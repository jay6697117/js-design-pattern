new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(111)
  }, 3000)
}).then((res)=>{
  console.log('res', res)
}).finally(()=>{
  console.log('finally');
})
