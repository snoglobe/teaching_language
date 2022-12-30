const TokenType = { // The different types of tokens we can have.
    Word: "Word",
    Number: "Number",
    String: "String",

    Fn: "Fn",
    Var: "Var",
    If: "If",
    Else: "Else",
    While: "While",
    True: "True",
    False: "False",
    And: "And",
    Or: "Or",
    Return: "Return",

    LeftParen: "LeftParen",
    RightParen: "RightParen",
    LeftBrace: "LeftBrace",
    RightBrace: "RightBrace",
    Comma: "Comma",
    Plus: "Plus",
    Minus: "Minus",
    Times: "Times",
    Divide: "Divide",
    Equal: "Equal",
    Equality: "Equality",
    LessThan: "LessThan",
    GreaterThan: "GreaterThan",

    Eof: "Eof"
}

const keywords = { // A list of words built-in to the language
    "var": TokenType.Var,
    "fn": TokenType.Fn,
    "if": TokenType.If,
    "while": TokenType.While,
    "else": TokenType.Else,
    "true": TokenType.True,
    "false": TokenType.False,
    "and": TokenType.And,
    "or": TokenType.Or,
    "return": TokenType.Return
}

let lexer = {
    current: 0,
    source: "",
    tokens: [],
    line: 1
}

function initLexer(source) {
    lexer.current = 0
    lexer.source = source
    lexer.tokens = []
    lexer.line = 1
}

function advance() {
    if (lexer.current >= lexer.source.length) {
        return '\0'
    }
    return lexer.source[lexer.current++]
}

function peek() {
    if(lexer.current >= lexer.source.length) {
        return '\0'
    }
    return lexer.source[lexer.current];
}

function isAlphaNumeric(str) {
    return isAlpha(str) || isNumeric(str)
}

function codeOf(character) {
    return character.charCodeAt(0)
}

function isAlpha(str) {
    let code = str.charCodeAt(0)
    return (code >= codeOf('a') && code <= codeOf('z')) ||
           (code >= codeOf('A') && code <= codeOf('Z')) ||
           code === codeOf('_')
}

function isNumeric(str) {
    let code = str.charCodeAt(0)
    return (code >= codeOf('0') && code <= codeOf('9')) // Is it a number?
}

function match(character) {
    if(peek() === character) {
        advance()
        return true
    }
    return false
}

function newToken(type, value, text) {
    return {
        type: type,
        value: value,
        text: text,
        line: lexer.line
    }
}

function addToken(type, value, text) {
    lexer.tokens.push(newToken(type, value, text)) // Adds a new token to the stream.
}

function scanTokens() {
    while(lexer.current < lexer.source.length) {
        scanToken()
    }
    addToken(TokenType.Eof, "", "")
    return lexer.tokens
}

function scanToken() {
    let character = advance()
    switch(character) {
        case "(": addToken(TokenType.LeftParen, "(", "("); break;
        case ")": addToken(TokenType.RightParen, ")", ")"); break;
        case "{": addToken(TokenType.LeftBrace, "{", "{"); break;
        case "}": addToken(TokenType.RightBrace, "}", "}"); break;
        case ",": addToken(TokenType.Comma, ",", ","); break;
        case "+": addToken(TokenType.Plus, "+", "+"); break;
        case "-": addToken(TokenType.Minus, "-", "-"); break;
        case "*": addToken(TokenType.Times, "*", "*"); break;
        case "/": addToken(TokenType.Divide, "/", "/"); break;
        case "=":
            if (match("=")) {
                addToken(TokenType.Equality, "==", "==");
            } else {
                addToken(TokenType.Equal, "=", "=");
            }
            break;
        case "\"": string(); break;
        case "<": addToken(TokenType.LessThan, "<", "<"); break;
        case ">": addToken(TokenType.GreaterThan, ">", ">"); break;
        case " ": break; // Skip whitespace
        case "\n":
            lexer.line++
            break; // Skip newlines
        case "\r": break; // Skip carriage returns
        case "\t": break; // Skip tabs
        default:
            if(isAlpha(character)) {
                lexer.current-- // Backtrack so we can read the whole word.
                identifier()
            } else if(isNumeric(character)) {
                lexer.current-- // Backtrack so we can read the whole number.
                number()
            } else {
                output.error("Unexpected character: " + character)
            }
    }
}

function identifier() {
    let text = ""
    while(isAlphaNumeric(peek())) {
        text += advance()
    }
    let type = keywords[text]
    if(type === undefined) {
        type = TokenType.Word
    }
    addToken(type, text, text)
}

function peekNext() {
    if(lexer.current + 1 >= lexer.source.length) {
        return '\0'
    }
    return lexer.source[lexer.current + 1]
}

function number() {
    let text = ""
    while(isNumeric(peek())) {
        text += advance()
    }
    if (peek() === '.' && isNumeric(peekNext())) {
        text += advance()
        while(isNumeric(peek())) {
            text += advance()
        }
    }
    addToken(TokenType.Number, parseFloat(text), text)
}

function string() {
    let text = ""
    while(peek() !== "\"" && peek() !== '\0') {
        if(peek() === "\n") {
            lexer.line++
        }
        text += advance()
    }
    if(peek() === '\0') {
        console.error("Unterminated string.")
        return
    }
    advance() // Consume the closing quote.
    addToken(TokenType.String, text, text)
}

