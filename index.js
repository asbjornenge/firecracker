function getRootRef(fp) {
    var root = fp.root
    if (fp._path) root = root.child(fp._path)
    if (fp._take) root = root.limitToFirst(fp._take)
    if (fp._from) root = (typeof fp._from == 'number') ? root.startAt(fp._from) : root.startAt(null, fp._from)
    return root
}

function transformSnapshot(snapshot) {
    var s = snapshot.val()
    s.fid = snapshot.name()
    return s
}

var firecracker = function(root) {
    this.root      = root
    this.listeners = {}
}
firecracker.prototype.from    = function(last_seen) { this._from = last_seen; return this }
firecracker.prototype.take    = function(limit)     { this._take = limit; return this }
firecracker.prototype.path    = function(path)      { this._path = path; return this }
firecracker.prototype.on      = function(event, fn) { !this.listeners[event] ? this.listeners[event] = [fn] : this.listeners[event].push(fn); return this }
firecracker.prototype.off     = function(event, fn) {
    if (!this.listeners[event]) return this
    var index;
    for (var i in this.listeners[event]) {
        if (this.listeners[event][i] === fn) index = i;
    }
    if (index != undefined) { this.listeners[event].splice(index,1) }
    return this
}
firecracker.prototype.push    = function(data, cb)  {
    var ref  = getRootRef(this).push(data)
    if (typeof cb === 'function') cb(ref.name())
    return this
}
firecracker.prototype.remove  = function(id, callback) {
    getRootRef(this).remove(id, callback)
    return this
}
firecracker.prototype.once = function(callback) {
    getRootRef(this).once('value', function(snapshot) {
        var values = snapshot.val()
        var data   = Object.keys(values).map(function(id) {
            values[id].fid = id
            return values[id]
        }).reverse()
        if (typeof callback === 'function') callback(data)
    })
    return this
}
firecracker.prototype.listen = function() {
    var root = getRootRef(this)

    if (this.listeners.child_added) {
        root.on('child_added', function(child, prev) {
            this.listeners.child_added.forEach(function(fn) { fn(transformSnapshot(child), prev) })
        }.bind(this))
    }

    if (this.listeners.child_changed) {
        root.on('child_changed', function(child) {
            this.listeners.child_changed.forEach(function(fn) { fn(transformSnapshot(child)) })
        }.bind(this))
    }

    if (this.listeners.child_removed) {
        root.on('child_removed', function(child) {
            this.listeners.child_removed.forEach(function(fn) { fn(transformSnapshot(child)) })
        }.bind(this))
    }

    if (this.listeners.child_moved) {
        root.on('child_moved', function(child, prev) {
            this.listeners.child_moved.forEach(function(fn) { fn(transformSnapshot(child), prev) })
        }.bind(this))
    }

    if (this.listeners.value) {
        root.on('value', function(data) {
            this.listeners.value.forEach(function(fn) { fn(transformSnapshot(data)) })
        }.bind(this))
    }
}
module.exports = function(root) { return new firecracker(root) }
