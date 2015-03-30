var assert    = require('assert')
var firecracker = require('../index')

var fakeref  = {
    key : function() { return 1234 },
    val : function() { return {} }
}
var fakeroot = {
    push    : function()      { return fakeref },
    remove  : function(id,cb) { cb() },
    once    : function(e,cb)  { cb(fakeref) },
    on      : function(e,fn)  { this.fns ? this.fns.push(fn) : this.fns = [fn] },
    trigger : function(e,d)   { this.fns.forEach(function(fn) { fn(d) }) }
}

describe('FIRECRACKER', function() {

    it('Should expose the root', function() {
        var root = {}
        assert(firecracker(root).root === root)
    })

    it('Can bind callbacks with .on', function() {
        var cb = function() {}
        assert(firecracker().on('child_added', cb).listeners.child_added[0] === cb)
    })

    it('Can remove callbacks with .off', function() {
        var cb1 = function() {}
        var cb2 = function() {}
        var ref = firecracker()
            .on('child_added', cb1)
            .on('child_added', cb2)
        assert(ref.listeners.child_added.length === 2)
        ref.off('child_added', cb2)
        assert(ref.listeners.child_added.length === 1)
        assert(ref.listeners.child_added[0] == cb1)
    })

    it('Can set a limit using .take', function() {
        assert(firecracker().take(5)._take == 5)
    })

    it('Can set a child path using .path', function() {
        assert(firecracker().path("/user/13")._path == "/user/13")
    })

    it('Can push data to a location', function(done) {
        firecracker(fakeroot).push({}, function() {
            assert(true)
            done()
        })
    })

    it('Can remove data at a location', function(done) {
        firecracker(fakeroot).remove(1234, function() {
            assert(true)
            done()
        })
    })

    it('Can get data .once', function(done) {
        firecracker(fakeroot).once(function() {
            assert(true)
            done()
        })
    })

    it('Will start listening for events on .listen', function(done) {
        firecracker(fakeroot).on('child_added', function() {
            assert(true)
            done()
        }).listen()
        fakeroot.trigger('child_added', fakeref)
    })

})
