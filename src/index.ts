import { Context, Middleware, Next } from 'koa';
import { pathToRegexp } from 'path-to-regexp';

declare module 'koa' {
    interface BaseContext {
        mountPath: string;
    }
}

type MatchResult = {
    matched: boolean;
    newPath: string;
    mountPath: string;
}

// Mount a middleware function to a path
export = function(path: string | RegExp, middleware: Middleware) {
    const match = matcher(path);

    return async (ctx: Context, next: Next) => {
        const prev = ctx.path;
        const { matched, newPath, mountPath } = match(prev);

        if (matched) {
            ctx.path = newPath;
            ctx.mountPath = mountPath;
            await middleware(ctx, async () => {
                ctx.path = prev;
                await next();
                ctx.path = newPath;
            });
            ctx.path = prev;
        } else {
            await next();
        }
    }
}

// Create a matcher function from a path string or a regular expression
function matcher(pattern: string | RegExp): (path: string) => MatchResult {
    const regexp = typeof pattern === 'string' ? pathToRegexp(pattern) : pattern;

    return (path: string) => {
        const matches = regexp.exec(path);
        const matched = !!matches;
        const mountPath = matched ? matches[0] : '';
        let newPath = matched ? path.substring(mountPath.length) : path;

        // Ensure that the new path starts with a slash
        if (!newPath.startsWith('/')) {
            newPath = `/${newPath}`;
        }

        return { matched, newPath, mountPath };
    }
}