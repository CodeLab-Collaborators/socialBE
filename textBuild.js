(posted = [
  {
    _id: "64c74e133a0907e154d82093",
    post: "coding the new found love...@",
    userID: "64c13e3e29108f1f0d8b73fb",
    mediaFile:
      "https://res.cloudinary.com/newcodelabstudents24/image/upload/v1690783249/jqsw8kckziajx1zjcmcs.png",
    user: "64c13e3e29108f1f0d8b73fb",
    createdAt: "2023-07-31T06:00:51.496Z",
    updatedAt: "2023-07-31T06:00:51.496Z",
    __v: 0,
  },
  {
    _id: "64c74e613a0907e154d82097",
    post: "The morining is so cool and peaceful...!",
    userID: "64c13e3e29108f1f0d8b73fb",
    mediaFile:
      "https://res.cloudinary.com/newcodelabstudents24/image/upload/v1690783327/q4rx88sovydu1oedattw.png",
    user: "64c13e3e29108f1f0d8b73fb",
    createdAt: "2023-07-31T06:02:09.442Z",
    updatedAt: "2023-07-31T06:02:09.442Z",
    __v: 0,
  },
  {
    _id: "64c74eb73a0907e154d8209c",
    post: "Let love more, live life more and help the poor more!",
    userID: "64c13be3baac24fb461c99d7",
    mediaFile:
      "https://res.cloudinary.com/newcodelabstudents24/image/upload/v1690783413/nobhga8mhea36loi3tmi.png",
    user: "64c13be3baac24fb461c99d7",
    createdAt: "2023-07-31T06:03:35.665Z",
    updatedAt: "2023-07-31T06:03:35.665Z",
    __v: 0,
  },
  {
    _id: "64c7596e977404974871a600",
    post: "I have the Power to do all things!",
    userID: "64c10efadecbe906de6636ca",
    mediaFile:
      "https://res.cloudinary.com/newcodelabstudents24/image/upload/v1690786156/s49q36p8mxilxifytrao.png",
    user: "64c10efadecbe906de6636ca",
    createdAt: "2023-07-31T06:49:18.971Z",
    updatedAt: "2023-07-31T06:49:18.971Z",
    __v: 0,
  },
]),
  (friends = [
    "64c13be3baac24fb461c99d7",
    "64c13e3e29108f1f0d8b73fb",
    "64c13e3e29108f1f0d8b73fb",
  ]);

const result = posted.filter((el) => friends.includes(el.userID));

console.log(result);
