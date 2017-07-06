var fs = require("fs");
var packageJson = require('../package.json');

function map (o1,o2) {
  Object.keys(o1).forEach((key)=>{
    if (o2[key]) {
      console.log(key,o2[key])
      Object.assign(o1, {
        [key]: o2[key]
      });

    }
  })
}

function main() {
  fs.readdir("./node_modules", function (err, dirs) {
    if (err) {
      console.log(err);
      return;
    }

    let installedPackages = {};

    dirs.forEach(function(dir){
      if (dir.indexOf(".") !== 0) {
        var packageJsonFile = "./node_modules/" + dir + "/package.json";
        if (fs.existsSync(packageJsonFile)) {
          try {
            let data = fs.readFileSync(packageJsonFile)

            var json = JSON.parse(data);
            // console.log('"'+json.name+'": "' + json.version + '",');
            installedPackages[json.name] = json.version;

          } catch (err) {
            console.err('read file error',err)
          }
        }
      }
    });

    map(packageJson.dependencies,installedPackages);
    map(packageJson.devDependencies,installedPackages);

    console.log(JSON.stringify(packageJson,null,2))
  });


}

main();

