let parser = {
    tokens: [],
    current: 0,
}

function initParser(tokens) {
    parser.tokens = tokens
    parser.current = 0
}

function peekTok() {
    if (parser.current >= parser.tokens.length) {
        return null
    }
    return parser.tokens[parser.current].type
}

function eat(type) {
    if (peekTok() === type) {
        return parser.tokens[parser.current++]
    }
    console.error("Expected " + type + " but got " + peekTok())
    parser.current++ // Skip the token
}

// optional(id) followed by list of ("," id)
function idList() {
    let list = []
    if (peekTok() === TokenType.Word) {
        list.push(eat(TokenType.Word).text)
        while (peekTok() === TokenType.Comma) {
            eat(TokenType.Comma)
            list.push(eat(TokenType.Word).text)
        }
    }
    return list
}

// optional(expr) followed by list of ("," expr)
function exprList() {
    let list = []
    if (peekTok() !== TokenType.RightParen) {
        list.push(expr())
        while (peekTok() === TokenType.Comma) {
            eat(TokenType.Comma)
            list.push(expr())
        }
    }
    return list
}

// var id = expr
function varDecl() {
    eat(TokenType.Var)
    let id = eat(TokenType.Word).text
    eat(TokenType.Equal)
    let value = expr()
    return NewVar(id, value)
}

// fn id (idList) { stmtList }
function fnDecl() {
    eat(TokenType.Fn)
    let id = eat(TokenType.Word).text
    eat(TokenType.LeftParen)
    let params = idList()
    eat(TokenType.RightParen)
    eat(TokenType.LeftBrace)
    let body = []
    while (peekTok() !== TokenType.RightBrace) {
        body.push(stmt())
    }
    eat(TokenType.RightBrace)
    return NewFn(id, params, body)
}

// return expr
function returnStmt() {
    eat(TokenType.Return)
    let value = expr()
    return NewReturn(value)
}

// if expr {stmtList} else {stmtList}
function ifStmt() {
    eat(TokenType.If)
    let condition = expr()
    eat(TokenType.LeftBrace)
    let thenBranch = []
    while (peekTok() !== TokenType.RightBrace) {
        thenBranch.push(stmt())
    }
    eat(TokenType.RightBrace)
    let elseBranch = []
    if (peekTok() === TokenType.Else) {
        eat(TokenType.Else)
        eat(TokenType.LeftBrace)
        while (peekTok() !== TokenType.RightBrace) {
            elseBranch.push(stmt())
        }
        eat(TokenType.RightBrace)
    }
    return NewIf(condition, thenBranch, elseBranch)
}

// while expr {stmtList}
function whileStmt() {
    eat(TokenType.While)
    let condition = expr()
    eat(TokenType.LeftBrace)
    let body = []
    while (peekTok() !== TokenType.RightBrace) {
        body.push(stmt())
    }
    eat(TokenType.RightBrace)
    return NewWhile(condition, body)
}

// stmt = varDecl | fnDecl | returnStmt | ifStmt | whileStmt | expr
function stmt() {
    switch (peekTok()) {
        case TokenType.Var:
            return varDecl()
        case TokenType.Fn:
            return fnDecl()
        case TokenType.Return:
            return returnStmt()
        case TokenType.If:
            return ifStmt()
        case TokenType.While:
            return whileStmt()
        default:
            return expr()
    }
}

// simple = id | number | string | true | false | fn(idList) {stmtList} | (expr)
function simple() {
    let token = eat(peekTok())
    switch (token.type) {
        case TokenType.Word:
            return NewVariable(token.text)
        case TokenType.Number:
            return NewNumber(token.value)
        case TokenType.String:
            return NewString(token.text)
        case TokenType.True:
            return NewBool(true)
        case TokenType.False:
            return NewBool(false)
        case TokenType.Fn:
            eat(TokenType.LeftParen)
            let params = idList()
            eat(TokenType.RightParen)
            eat(TokenType.LeftBrace)
            let body = []
            while (peekTok() !== TokenType.RightBrace) {
                body.push(stmt())
            }
            eat(TokenType.RightBrace)
            return NewLambda(params, body)
        case TokenType.LeftParen:
            let result = expr()
            eat(TokenType.RightParen)
            return result
        default:
            console.error("Expected expression but got " + token.type)
            lexer.current++ // Skip the token
            return null
    }
}

// call = simple (exprList)
function call() {
    let expr = simple()
    if (peekTok() === TokenType.LeftParen) {
        eat(TokenType.LeftParen)
        let args = exprList()
        eat(TokenType.RightParen)
        return NewCall(expr, args)
    }
    return expr
}

function isOp(token) {
    return token === TokenType.Plus ||
        token === TokenType.Minus ||
        token === TokenType.Times ||
        token === TokenType.Divide ||
        token === TokenType.LessThan ||
        token === TokenType.GreaterThan ||
        token === TokenType.Equality ||
        token === TokenType.Equal ||
        token === TokenType.And ||
        token === TokenType.Or
}

// expr = call ?(op expr)
function expr() {
    let left = call()
    if (isOp(peekTok())) {
        let op = eat(peekTok()).text
        let right = expr()
        return NewBinOp(left, right, op)
    }
    return left
}

// program = list of stmt
function program() {
    let list = []
    while (peekTok() !== TokenType.Eof) {
        list.push(stmt())
    }
    return list
}