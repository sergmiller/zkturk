export function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

export function assertType(val, type) {
    if (typeof val != 'object') {
      if (typeof val != type.name.replace(/^./, function(f){return f.toLowerCase();}))
        throw new Error("`" + val + "` is not of the data type `" + type.name + "`.");
    }
    else if (!(val instanceof type)) {
        throw new Error("`" + val + "` is not of the data type `" + type.name + "`.");
    }
}

// TODO: rm hack for html.
window.assert = assert
