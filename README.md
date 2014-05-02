# firecracker

Firecracker is a small wrapper around the [firebase](https://www.firebase.com/) js client.  
It takes a root and allows you to compose in some nice ways. It will also unpack val & name.

### Install

Firecracker is available on npm.

	npm install firecracker
	
### Use

    var root = new Firebase('http://my.firebase.root')
    firecracker(root)
        .path('/user/messages')
        .from('-JKUu24YeVsjhkDMfSkR')
        .on('child_added', function(child) {
            console.log(child.fid)
        })
        .on('child_updated', function(child) {
            console.log('update!')
        })
        .listen()

	
### Docs

For full documentation see the [spec](https://github.com/asbjornenge/firecracker/blob/master/test/spec.js).  

enjoy.