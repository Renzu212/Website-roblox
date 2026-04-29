fetch("https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=7864646425&size=420x420&format=Png&isCircular=false")
.then(res => {
  console.log("CORS header:", res.headers.get("access-control-allow-origin"));
  return res.json();
})
.then(data => console.log(data))
.catch(err => console.error(err));
