const { mock } = require("mockjs");
const { handleRandomImage } = require("../../../mock/utils");

const List = [];
const count = 999;
for (let i = 0; i < count; i++) {
  List.push(
    mock({
      uuid: "@uuid",
      id: "@id",
      title: "@csentence(1, 2)",
      "status|1": ["published", "draft", "deleted"],
      author: "@cname",
      datetime: "@datetime",
      pageViews: "@integer(300, 5000)",
      img: handleRandomImage(200, 200),
      smallImg: handleRandomImage(40, 40),
      switch: "@boolean",
      percent: "@integer(80,99)",
    })
  );
}


function getList(body){
  if (!body) {
    return {
      code: 200,
      msg: "success",
      totalCount: count,
      data: mock({
        "data|50": [
          {
            id: "@id",
            title: "@csentence(1, 2)",
            "status|1": ["published", "draft", "deleted"],
            author: "@cname",
            datetime: "@datetime",
            pageViews: "@integer(300, 5000)",
            img: handleRandomImage(200, 200),
            smallImg: handleRandomImage(40, 40),
            switch: "@boolean",
            percent: "@integer(80,99)",
          },
        ],
      }).data,
    };
  }
  const { title = "", pageNo = 1, pageSize = 20 } = body;
  let mockList = List.filter((item) => {
    return !(title && item.title.indexOf(title) < 0);
  });
  const pageList = mockList.filter(
    (item, index) =>
      index < pageSize * pageNo && index >= pageSize * (pageNo - 1)
  );
  return {
    code: 200,
    msg: "success",
    totalCount: count,
    data: pageList,
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
