const { mock } = require("mockjs");


function getList(body){
  return {
    code: 200,
    msg: "success",
    totalCount: 999,
    data: mock({
      "data|10": [
        {
          id: "@id",
        },
      ],
    }).data,
  };
}

function doEdit(body){
  return {
    code: 200,
    msg: "模拟保存成功",
  };
}

function doDelete(body){
  return {
    code: 200,
    msg: "模拟删除成功",
  };
}

module.exports = {
  getList,
  doEdit,
  doDelete
}
