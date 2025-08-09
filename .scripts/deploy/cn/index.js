const OSS = require('ali-oss')
const { glob } = require('glob')

const client = new OSS({
  region: 'oss-cn-hongkong',
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  authorizationV4: true,
  bucket: 'hkma-streaming-bucket',
})

// 自訂要求標頭
const headers = {
  // 指定Object的存取權限。
  'x-oss-object-acl': 'public-read',
}

async function uploadFile(path, filename) {
  // 填寫OSS檔案完整路徑和本地檔案的完整路徑。OSS檔案完整路徑中不能包含Bucket名稱。
  // 如果本地檔案的完整路徑中未指定本地路徑，則預設從樣本程式所屬專案對應本地路徑中上傳檔案。
  return client.put(
    filename,
    path,
    // 自訂headers
    { headers }
  )
}

async function main() {
  // 1. Load all files from ./dist
  const files = await glob('./dist/**/*.*')

  console.log(JSON.stringify(files, null, 2))
  console.log(`Total files: ${files.length}`)

  // 2. Upload files one by one
  for (const file of files) {
    await uploadFile(file, file.substring(file.indexOf('/') + 1))
    console.log(`Uploaded: ${file}`)
  }
}

main()
