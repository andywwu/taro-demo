
// eslint-disable-next-line import/prefer-default-export
export function formatSeconds(value) {
  var secondTime = parseInt(value);// 秒
  var minuteTime;// 分
  if (secondTime > 60) {//如果秒数大于60，将秒数转换成整数
    //获取分钟，除以60取整数，得到整数分钟
    minuteTime = parseInt(secondTime / 60) > 9 ? parseInt(secondTime / 60) : `0${parseInt(secondTime / 60)}`;
    //获取秒数，秒数取佘，得到整数秒数
    secondTime = parseInt(secondTime % 60) > 9 ? parseInt(secondTime % 60) : `0${parseInt(secondTime % 60)}`;
    //如果分钟大于60，将分钟转换成小时
  } else {
    secondTime = parseInt(secondTime) > 9 ? parseInt(secondTime) : `0${parseInt(secondTime)}`;
  }
  var result;
  if (minuteTime > 0) {
    result = minuteTime + ":" + secondTime;
  } else {
    result = `00:${secondTime}`;
  }
  return result;
}