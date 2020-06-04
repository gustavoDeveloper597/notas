console.log('db')
window.notas=[];
$(document).ready(function () {
    let db = new PouchDB('notas');
    db.changes({
        since: 'now',
        live: true
    }).on('change', cargaNotas);

    $('#nuevaNota').click(function () {
        $('#nota').val('');
        $('#seccion-nota').removeClass('oculta');
        $('#seccion-notas').addClass('oculta');

    });
    $('#guardaNota').click(function () {

        let nota = {
            _id: new Date().toISOString(),
            nota: $('#nota').val()
        }
        if (nota.nota.length > 0) {
            db.put(nota).then(res => {
                $('#seccion-nota').addClass('oculta');
                $('#seccion-notas').removeClass('oculta');

            });
        } else {
            alert('Escribe algo en la nota')
        }

    });

    $(document).on('click','.delete',function () {
        let id=$(this).attr('data-id');
        let nota=window.notas.find(n=>{

            return n._id==id;
        })
        console.log(nota)
        db.remove(nota);
    })

    function cargaNotas(){
        db.allDocs({include_docs: true, descending: true}).then(doc => {
            window.notas=[];
            let li='';
            doc.rows.forEach(row=>{
                window.notas.push(row.doc);
                li+=drawNota(row.doc);
            });
            $('#notas').html('');
            $('#notas').append(li);

        })
    }

    function drawNota(nota){
        console.log(nota)
        return ` <li class="list-group-item" data-id="${nota._id}">
                    ${nota.nota} <button class="btn btn-sm btn-danger pull-right delete" data-id="${nota._id}">Delete</button>
                  
                  </li>`;
    }

    cargaNotas()

});

