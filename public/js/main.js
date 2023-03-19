// let activeElements = document.querySelectorAll('.active-li')
// activeElements.forEach((e)=>{
//     e.addEventListener('click',function(e){
//      if(e.target.classList.contains='active'){
        
//      }
     
        
//     })
// })

// ========================



let searchBtn = document.querySelector('#search-input')
searchBtn.addEventListener('keyup',(e)=>{
    e.preventDefault();
    let search_text = document.querySelector('#search-input').value;
    let email = search_text
    if(email !== ""){
        let xhr = new XMLHttpRequest()
        xhr.open('GET',`http://localhost:3000/search/${email}`,true)
        xhr.send()
        xhr.onload = ()=>{
            if(xhr.status === 200){
                let data = xhr.responseText;
                let records = JSON.parse(data)
                // console.log(records)
                let temp = ''
                
                for(let record of records){
                
    
                temp += `<tr>
                <td id='adm' class="text-start">${record.email}</td>
                <td id='adm' class="text-start">${record.StdAdm}</td>
                <td  class="text-start">${record.studentName}</td>
                <td class="text-start">${record.Depart1}</td>
                <td class="text-start">Ksh.${record.Depart2}/=</td>
                <td class="text-start">${record.Depart3}</td> 
                <td>
                        <button class="btn btn-secondary btn-sm update" id="update" data-bs-toggle="modal" data-bs-target="#update-employee-modal" >Update</button>
                     <button class="btn btn-danger btn-sm delete" id="delete">Delete</button>
                </td>
                            
            </tr>`
                }
            document.querySelector('#table-body').innerHTML=temp
            }}
    }else{
        document.querySelector('#table-body').innerHTML='<tr>No records found</tr>'
    }
    let showBtn = document.querySelector('#show')
    showBtn.addEventListener('click',(e)=>{
        e.preventDefault()
        fetchRecords()
    })
    

})
window.addEventListener('DOMContentLoaded',()=>{
    fetchRecords()

    
        
}) 
    let fetchRecords = ()=>{
    let xhr = new XMLHttpRequest()
    xhr.open('GET','http://localhost:3000/clearance-record',true)
    xhr.send()
    xhr.onload = ()=>{
        if(xhr.status === 200){
            let data = xhr.responseText;
            let records = JSON.parse(data)
            
            let temp = ''
            
            for(let record of records){
            

            temp += `<tr>
            <td id='adm' class="text-start">${record.email}</td>
            <td id='adm' class="text-start">${record.StdAdm}</td>
            <td  class="text-start">${record.studentName}</td>
            <td class="text-start">${record.Depart1}</td>
            <td class="text-start">Ksh.${record.Depart2}/=</td>
            <td class="text-start">${record.Depart3}</td> 
            <td>
                    <button class="btn btn-secondary btn-sm update" id="update" data-bs-toggle="modal" data-bs-target="#update-employee-modal" >Update</button>
                 <button class="btn btn-danger btn-sm delete" id="delete">Delete</button>
            </td>
                        
        </tr>`
            }
        document.querySelector('#table-body').innerHTML=temp
        const deletebtn = document.querySelectorAll('#delete')
        const updatebtn = document.querySelectorAll('#update')

        deletebtn.forEach((e)=>{
            e.addEventListener('click',(e)=>{ 
                    let targetElement = e.target  
                    if(targetElement.classList.contains('delete')){
                        let selectedId = targetElement.parentElement.parentElement.firstElementChild.innerHTML;
                        // console.log(selectedId)
                        const xhr = new XMLHttpRequest();
                        xhr.open('DELETE',`http://localhost:3000/clearance-record/${selectedId}`,true)
                        xhr.setRequestHeader('Content-Type','application/json')
                        xhr.send()
                        xhr.onload = ()=>{
                            
                            fetchRecords()
                        }
                    }     
            })
        })
        // ========================================
      

        // =========================================
        updatebtn.forEach((e)=>{
            e.addEventListener('click',(e)=>{
                let targetElement = e.target  
                if(targetElement.classList.contains('update')){
                    let selectedId = targetElement.parentElement.parentElement.firstElementChild.innerHTML;
                    let xhr = new XMLHttpRequest()
                    xhr.open('GET',`http://localhost:3000/search/${selectedId}`,true)
                    xhr.send()
                    xhr.onload = ()=>{
                        if(xhr.status === 200){
                            let data = xhr.responseText;
                            
                            let populateForm = ()=>{
                                let record = JSON.parse(data)
                            
                                document.querySelector('#updateStudentName').value= record[0].studentName;
                                document.querySelector('#updateStudentAdm').value = record[0].StdAdm;
                                document.querySelector('#updateEmail').value = record[0].email;
                                document.querySelector('#updateDepart1').value = record[0].Depart1;
                                document.querySelector('#updateDepart2').value = record[0].Depart2;
                                document.querySelector('#updateDepart3').value = record[0].Depart3;
  
                            }
                        
                            populateForm();
                            
                        }
                       
                    }

                }
                
            })
        })
        }}}
