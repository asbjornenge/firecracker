# firecracker

[![browser support](https://ci.testling.com/asbjornenge/firecracker.png)
](https://ci.testling.com/asbjornenge/firecracker)

Firecracker is a small wrapper around the [firebase](https://www.firebase.com/) js client.  
It takes a root and allows you to compose in some nice ways. It will also unpack val & name.

## Install

Firecracker is available on npm.

	npm install firecracker
	
## Use

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

	
## Docs

For full documentation see the [spec](https://github.com/asbjornenge/firecracker/blob/master/test/spec.js).  

## Changelog

### 1.0.1

* Using .limitToLast to mimic previous .limit behaviour
* Using .key over .name

### 1.0.0

* Replaced .limit with .limitToFirst since .limit is being deprecated
* Aligning with semver

### 0.0.1

* Initial release

enjoy.
