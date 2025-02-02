const fs = require('fs');
const path = require('path');

export const getDirDataRecursive = (dirPath) => {
  const dirData = { name: path.basename(dirPath), children: [] };
  const filesAndDirs = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const fileOrDir of filesAndDirs) {
    if (fileOrDir.isFile()) {
      dirData.children.push({ name: fileOrDir.name, value: `${dirPath}/${fileOrDir.name}`.split("/users/")[1].replace(/^[^/]+\//, '') });
    } else if (fileOrDir.isDirectory()) {
      const subDirData = getDirDataRecursive(
        path.join(dirPath, fileOrDir.name)
      );
      dirData.children.push(subDirData);
    }
  }
  return dirData;
};

export const getUsersData = (dirPath) => {
  const usersData = [];
  const dirs = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const dir of dirs) {
    if (dir.isDirectory()) {
      const userData = { name: dir.name, children: [] };
      const dirFullPath = path.join(dirPath, dir.name);
      const filesAndDirs = fs.readdirSync(dirFullPath, {
        withFileTypes: true,
      });
      for (const fileOrDir of filesAndDirs) {
        if (fileOrDir.isFile()) {
          userData.children.push({ name: fileOrDir.name, value: `${dirFullPath}/${fileOrDir.name}`.split("/users/")[1].replace(/^[^/]+\//, '') });
        } else if (fileOrDir.isDirectory()) {
          const subDirData = getDirDataRecursive(
            path.join(dirFullPath, fileOrDir.name)
          );
          userData.children.push(subDirData);
        }
      }
      usersData.push(userData);
    }
  }
  return usersData;
};




export function generateDirectoryStructure(dirPath, keyPrefix = '') {
  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  const result = [];

  for (const item of items) {
    const itemPath = path.join(dirPath, item.name);
    const isDirectory = item.isDirectory();
    const label = keyPrefix + item.name;
    const value = isDirectory ? `${label}/` : label;

    if (isDirectory) {
      if (label.split('/').length > 4) {
        const shortenedKey = label.split('/').slice(-3).join('/');
        result.push({ label: shortenedKey, value: `${label}` });
      } else {
        result.push({ label, value: `${label}` });
      }

      const subItems = generateDirectoryStructure(itemPath, `${label}/`);
      result.push(...subItems);
    }
  }

  return result;
}



function getDirectoryTree(directoryPath) {
  const result = {};

  const walk = (dirPath, obj) => {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });

    obj.directory = [];
    obj.files = [];

    files.forEach((file) => {
      if (file.isDirectory()) {
        const directoryPath = path.join(dirPath, file.name);
        const directoryObj = {
          directory: [],
          files: [],
        };
        obj.directory.push(file.name);
        obj[file.name] = directoryObj;
        walk(directoryPath, directoryObj);
      } else {
        obj.files.push(file.name);
      }
    });
  };

  walk(directoryPath, result);
  return result;
}

function formatDirectoryTree(directoryTree) {
  const formattedTree = {};

  const processDir = (dirObj, tree, parentKey = '') => {
    const currentPath = parentKey ? `${parentKey}/${dirObj}` : dirObj;
    const currentObj = tree[dirObj];
    formattedTree[currentPath] = {
      directory: currentObj.directory.map((dir) => ({ label: dir, value: `${currentPath}/${dir}` })),
      files: currentObj.files.map((file) => ({ label: file, value: `${currentPath}/${file}` }))
    };
    currentObj.directory.forEach((dir) => {
      processDir(dir, currentObj, currentPath);
    });
  };

  Object.keys(directoryTree).forEach((dir) => {
    if (dir !== 'directory' && dir !== 'files') {
      processDir(dir, directoryTree);
    }
  });

  return formattedTree;
}

export function generateDirectoryFilese(pathLink) {
  const directoryTree = getDirectoryTree(pathLink);
  const formattedTree = formatDirectoryTree(directoryTree);
  return formattedTree;
}


export const getUsersDataContent = (dirPath) => {
  let result = [];
  const files = fs.readdirSync(dirPath);
  files.forEach((file, index) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      const subDirFiles = getUsersDataContent(filePath);
      if (subDirFiles.length > 0) {
        result = result.concat(subDirFiles);

      }
    } else {
      if (path.extname(file) === '.json') {
        let content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        result.push({ id: result.length + 1, path: filePath.split("/users/")[1].replace(/^[^/]+\//, ''), content });
      }
    }
  });
  return result;
};

export const getUsersDataPath = (dirPath) => {
  let result = [];
  const files = fs.readdirSync(dirPath);
  files.forEach((file, index) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      const subDirFiles = getUsersDataPath(filePath);
      if (subDirFiles.length > 0) {
        result = result.concat(subDirFiles);

      }
    } else {
      if (path.extname(file) === '.json') {
        result.push(filePath.split("/users/")[1].replace(/^[^/]+\//, '').split(".json")[0]);
      }
    }
  });
  return result;
};