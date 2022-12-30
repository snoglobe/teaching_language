const AstType = {
    Var: "Var",
    Fn: "Fn",
    Return: "Return",
    If: "If",
    While: "While",

    Variable: "Variable",
    Number: "Number",
    String: "String",
    Bool: "Bool",
    BinOp: "BinOp",
    Call: "Call",
    Lambda: "Lambda",
}

const Var = {
    type: AstType.Var,
    name: "",
    value: null,
}

function NewVar(name, value) {
    let varObj = {...Var}
    varObj.name = name
    varObj.value = value
    return varObj
}

const Fn = {
    type: AstType.Fn,
    name: "",
    args: [],
    body: null,
}

function NewFn(name, args, body) {
    let fn = {...Fn}
    fn.name = name
    fn.args = args
    fn.body = body
    return fn
}

const Return = {
    type: AstType.Return,
    value: null,
}

function NewReturn(value) {
    let ret = {...Return}
    ret.value = value
    return ret
}

const If = {
    type: AstType.If,
    condition: null,
    body: null,
    else: null,
}

function NewIf(condition, body, elseBody) {
    let ifObj = {...If}
    ifObj.condition = condition
    ifObj.body = body
    ifObj.else = elseBody
    return ifObj
}

const While = {
    type: AstType.While,
    condition: null,
    body: null,
}

function NewWhile(condition, body) {
    let whileObj = Object.create(While)
    whileObj.condition = condition
    whileObj.body = body
    return whileObj
}

const Variable = {
    type: AstType.Variable,
    name: "",
}

function NewVariable(name) {
    let varObj = {...Variable}
    varObj.name = name
    return varObj
}

const Number = {
    type: AstType.Number,
    value: 0,
}

function NewNumber(value) {
    let num = {...Number}
    num.value = value
    return num
}

const String = {
    type: AstType.String,
    value: "",
}

function NewString(value) {
    let str = {...String}
    str.value = value
    return str
}

const Bool = {
    type: AstType.Bool,
    value: false,
}

function NewBool(value) {
    let bool = {...Bool}
    bool.value = value
    return bool
}

const BinOp = {
    type: AstType.BinOp,
    left: null,
    right: null,
    op: null
}

function NewBinOp(left, right, op) {
    let binOp = {...BinOp}
    binOp.left = left
    binOp.right = right
    binOp.op = op
    return binOp
}

const Call = {
    type: AstType.Call,
    func: null,
    args: []
}

function NewCall(func, args) {
    let call = {...Call}
    call.func = func
    call.args = args
    return call
}

const Lambda = {
    type: AstType.Lambda,
    args: [],
    body: null,
}

function NewLambda(args, body) {
    let lambda = {...Lambda}
    lambda.args = args
    lambda.body = body
    return lambda
}

