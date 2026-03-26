
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({ //بالكود بتاعى cloudinary  هنا بربط ال 
  cloud_name: 'dja0pm7bg', 
  api_key: '542947549219159', 
  api_secret: 'Oa22QpFs3BqjC_aQtP9s-hbBemY'
});

export default cloudinary



// cloudinary --> "image - audio - vedio -files "  media خاص بال  server "host" & high performance بحيث الصوره هتتعرض لليوزر اسرع لان لو عندى لوكال ساعتها كل الصور هتتعرض من نفس السيرفر فالتحميل هيبقى زياده ولو السيرفر حصله كراش فى اى وقت الصور متروحش 
//https://cloudinary.com/documentation  --> login --> home--> Product Environment--> Go to api keys "api key & api secret"
//api key : 542947549219159
// api secret : Oa22QpFs3BqjC_aQtP9s-hbBemY
// cloud name : dja0pm7bg
//install --> npm i cloudinary