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
      where s.id = c.id
      and  s.weekday = ${filters.weekday}
      and s.time_from <= ${timeToMinutes}
      and s.time_to >= ${timeToMinutes}
   ) and c.subject = "${filters.subject}"
  `
  try {
     const db = await Database
     const proffys = await db.all(query)
      return res.render("study.html",{ proffys, filters,subjects , weekdays })
    
  } catch (error) {
    console.log(error)
  }
}


function pageGiveClasses(req,res){
  const data = req.query
  const isNotEmpty =Object.keys(data).length > 0

  if(isNotEmpty){
    data.subject = getSubject(data.subject)
    proffys.push(data)
    return res.redirect("/study")
  }
  else{
    return res.render("give-classes.html",{data, subjects , weekdays})
  }
}
module.exports = {
  pageLanding,
  pageStudy,
  pageGiveClasses 
}