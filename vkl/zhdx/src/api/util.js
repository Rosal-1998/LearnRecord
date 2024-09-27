
/**
 * 生成随机len位数字
 */
export const randomLenNum = (len, date) => {
	let random = "";
	random = Math.ceil(Math.random() * 100000000000000)
		.toString()
		.substr(0, len || 4);
	if (date) random = random + Date.now();
	return random;
};
// 转换字符串，undefined,null等转化为""
export function parseStrEmpty(str) {
  if (!str || str == "undefined" || str == "null") {
    return "";
  }
  return str;
}
// 构造树状结构
export function handleTree(data, id, parentId, children) {
  let config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children'
  };

  var childrenListMap = {};
  var nodeIds = {};
  var tree = [];

  for (let d of data) {
    let parentId = d[config.parentId];
    if (childrenListMap[parentId] == null) {
		 childrenListMap[parentId] = [];
    }
    nodeIds[d[config.id]] = d;
    childrenListMap[parentId].push(d);
  }

  for (let d of data) {
    let parentId = d[config.parentId];
    if (nodeIds[parentId] == null) {
      tree.push(d);
    }
  }

  for (let t of tree) {
    adaptToChildrenList(t);
  }

  function adaptToChildrenList(o) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]];
    }
    if (o[config.childrenList]) {
      for (let c of o[config.childrenList]) {
        adaptToChildrenList(c);
      }
    }
  }
  return tree;
  console.log(tree,'0----')
}

export default function uuid() {
  var uuid = []
  var hexDigits = '0123456789abcdef'
  for (var i = 0; i < 36; i++) {
    uuid[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  uuid[14] = '4'
  uuid[19] = hexDigits.substr((uuid[19] & 0x3) | 0x8, 1)
  uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
  return 'u' + uuid.join('').replaceAll('-', '')
}