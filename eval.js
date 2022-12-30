let variables = {
    print: function (x) {
        output.innerHTML += x + "\n";
    },
    prompt: function (x) {
        return prompt(x);
    }
}

class ReturnException {
    constructor(value) {
        this.value = value;
    }
}

function execute(ast, scope = variables) {
    switch (ast.type) {
        case AstType.Var:
            if (ast.name in scope) {
                console.error("Variable " + ast.name + " already exists");
            }
            scope[ast.name] = evaluate(ast.value, scope);
            break;
        case AstType.Fn:
            scope[ast.name] = function (...args) {
                let localScope = Object.assign({}, scope);
                for (let i = 0; i < ast.args.length; i++) {
                    localScope[ast.args[i]] = args[i];
                }
                try {
                    for (let i = 0; i < ast.body.length; i++) {
                        execute(ast.body[i], localScope);
                    }
                } catch (e) {
                    if(e instanceof ReturnException) {
                        return e.value;
                    }
                    throw e;
                }
                return null;
            }
            break;
        case AstType.Return:
            throw new ReturnException(evaluate(ast.value, scope));
        case AstType.If:
            if (evaluate(ast.condition, scope)) {
                for (let i = 0; i < ast.body.length; i++) {
                    execute(ast.body[i], scope);
                }
            } else {
                for (let i = 0; i < ast.else.length; i++) {
                    execute(ast.else[i], scope);
                }
            }
            break;
        case AstType.While:
            while (evaluate(ast.condition, scope)) {
                for (let i = 0; i < ast.body.length; i++) {
                    execute(ast.body[i], scope);
                }
            }
            break;
        default:
            evaluate(ast, scope);
            break;
    }
}

function evaluate(ast, scope = variables) {
    switch (ast.type) {
        case AstType.Number:
        case AstType.String:
        case AstType.Bool:
            return ast.value;
        case AstType.Variable:
            if (ast.name in scope) {
                return scope[ast.name];
            }
            console.error("Variable " + ast.name + " does not exist");
            break;
        case AstType.BinOp:
            switch (ast.op) {
                case "+":
                    return evaluate(ast.left, scope) + evaluate(ast.right, scope);
                case "-":
                    return evaluate(ast.left, scope) - evaluate(ast.right, scope);
                case "*":
                    return evaluate(ast.left, scope) * evaluate(ast.right, scope);
                case "/":
                    return evaluate(ast.left, scope) / evaluate(ast.right, scope);
                case "==":
                    return evaluate(ast.left, scope) === evaluate(ast.right, scope);
                case "=":
                    return scope[ast.left.name] = evaluate(ast.right, scope);
                case "<":
                    return evaluate(ast.left, scope) < evaluate(ast.right, scope);
                case ">":
                    return evaluate(ast.left, scope) > evaluate(ast.right, scope);
                case "and":
                    return evaluate(ast.left, scope) && evaluate(ast.right, scope);
                case "or":
                    return evaluate(ast.left, scope) || evaluate(ast.right, scope);
            }
            break;
        case AstType.Call:
            let args = [];
            for (let i = 0; i < ast.args.length; i++) {
                args.push(evaluate(ast.args[i], scope));
            }
            return evaluate(ast.func, scope)(...args);
        case AstType.Lambda:
            return function (...args) {
                let localScope = Object.assign({}, scope);
                for (let i = 0; i < ast.args.length; i++) {
                    localScope[ast.args[i]] = args[i];
                }
                try {
                    for (let i = 0; i < ast.body.length; i++) {
                        execute(ast.body[i], localScope);
                    }
                } catch (e) {
                    if(e instanceof ReturnException) {
                        return e.value;
                    }
                    throw e;
                }
                return null;
            }
    }
}

