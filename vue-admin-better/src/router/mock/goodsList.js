const { mock } = require("mockjs");

const List = [];
const count = 999;
let num = 0;
for (let i = 0; i < count; i++) {
  List.push(
    mock({
      uuid: "@uuid",
      image: `https://picsum.photos/300/600?random=${num++}`,
      title: "@ctitle",
      description: "@csentence",
      link: "https://www.baidu.com",
      price: "@integer(100, 500)",
      "status|1": [1, 0],
      "isRecommend|1": [1, 0],
    })
  );
}

function getList(body) {
  const { title = "", pageNo = 1, pageSize = 20 } = body;
  let mockList = List.filter((item) => {
    if (title && item.title.indexOf(title) < 0) return false;
    return true;
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

module.exports = {
  getList,
};
