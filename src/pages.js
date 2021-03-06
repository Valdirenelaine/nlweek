const Database = require('./database/db')
const { subjects,  weekdays,  getSubject, convertHoursToMinutes}  = require ('./utils/format')

 function pageLanding(reg,res){
  return res.render("index.html")
 }

  const pageStudy= async (req,res)=> {
  const filters = req.query
  if(!filters.subject || !filters.weekday || !filters.time){
    return res.render("study.html",{filters,subjects , weekdays })
  }

  const timeToMinutes = convertHoursToMinutes(filters.time)
  const query = `
   select * 
   from proffys p
   join classes c on  (p.id = c.proffy_id)
   where exists(
      select * 
      from class_schedule s
      where s.class_id = c.id
      and s.weekday = ${filters.weekday}
      and s.time_from <= ${timeToMinutes}
      and s.time_to > ${timeToMinutes}
   ) and c.subject = "${filters.subject}"
  `
  try {
     const db = await Database
     const proffys = await db.all(query)
       proffys.map((proffy)=>{
        proffy.subject = getSubject(proffy.subject)
       })
      return res.render("study.html",{ proffys, filters,subjects , weekdays })
    
  } catch (error) {
    console.log(error)
  }
}


function pageGiveClasses(req,res){
    return res.render("give-classes.html",{subjects , weekdays})
  
}

const saveClasses= async (req,res)=> {
  const createProffy= require('./database/createProffy')
 const proffyValue = {
      name: req.body.name,
      avatar: req.body.avatar,
      whatsapp: req.body.whatsapp,
      bio: req.body.bio
   }
  const classValue ={
    subject: req.body.subject,
    cost: req.body.const

  } 
  const classScheduleValues = req.body.weekday.map((weekday,index) =>{
    return {
      weekday,
      time_from: convertHoursToMinutes(req.body.time_from[index]),
      time_to: convertHoursToMinutes(req.body.time_to[index])
    }
  })
  try {
    const db= await(Database)
    await createProffy(db,{proffyValue,classValue,classScheduleValues})
    let queryString="?subject="+req.body.subject
    queryString += "&weekday="+req.body.weekday[0]
    queryString += "&time="+req.body.time_from[0]
    return res.redirect("/study"+queryString)
  } catch (error) {
    console.log(error)
  }
 
}
module.exports = {
  pageLanding,
  pageStudy,
  pageGiveClasses,
  saveClasses 
}