var fs = require('fs');

function getFiles (dir) {
    var files_ = {},
        files = fs.readdirSync(dir);
    for (var i in files) {
        var name = dir + '/' + files[i];
        if (!fs.statSync(name).isDirectory() && name.indexOf('.js') > -1 && name.indexOf('.json') == -1) {
            files_[files[i].replace('.js', '')] = name.replace('src/', './src/');
        }
    }
    return files_;
}

module.exports = getFiles;