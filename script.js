// =====================================
// MAPA DE RESERVAS - SCRIPT.JS
// PARTE 1
// =====================================


// HOSPEDAGENS

const hospedagens = [

"APTO 01(TRIPLO)",
"APTO 02(QUADRUPLO)",
"APTO 03(QUINTUPLO)",
"APTO 04(DUPLO COM VARANDA)",
"APTO 05(TRIPLO)",
"APTO 06(QUADRUPLO)",
"APTO 07(DUPLO)",
"APTO 08(DUPLO)",
"APTO 09(DUPLO)",
"APTO 10(DUPLO)",
"APTO 11(DUPLO)",
"APTO 12(DUPLO)",
"APTO 13(DUPLO)",
"APTO 14(DUPLO)",
"APTO 15(DUPLO)",
"APTO 16(TRIPLO)",
"APTO 17(DUPLO)",
"APTO 19(SEXTUPLO)",
"APTO 21(TRIPLO)"

];



// MESES

const meses = [

{nome:"Janeiro", dias:31},
{nome:"Fevereiro", dias:28},
{nome:"Março", dias:31},
{nome:"Abril", dias:30},
{nome:"Maio", dias:31},
{nome:"Junho", dias:30},
{nome:"Julho", dias:31},
{nome:"Agosto", dias:31},
{nome:"Setembro", dias:30},
{nome:"Outubro", dias:31},
{nome:"Novembro", dias:30},
{nome:"Dezembro", dias:31}

];



// CONFIGURAÇÕES

const larguraDia = 34;
let reservaEditando = null;
let mesAtual = new Date().getMonth();

let reservas = JSON.parse(
localStorage.getItem("reservas")
) || [];


// ELEMENTOS

const listaHospedagens =
document.getElementById("listaHospedagens");


const cabecalhoMeses =
document.getElementById("cabecalhoMeses");


const gradeReservas =
document.getElementById("gradeReservas");



const modal =
document.getElementById("modalReserva");



let casaSelecionada = "";




// =====================================
// CRIAR LISTA DAS CASAS
// =====================================


function carregarHospedagens(){


listaHospedagens.innerHTML="";


hospedagens.forEach(nome=>{


let div =
document.createElement("div");


div.className="quarto";


div.textContent=nome;


listaHospedagens.appendChild(div);


});


}



// =====================================
// CRIAR CABEÇALHO DO MÊS
// =====================================


function criarCabecalho(){


cabecalhoMeses.innerHTML="";


let mes =
meses[mesAtual];



let bloco =
document.createElement("div");


bloco.className="mes";



let titulo =
document.createElement("div");


titulo.className="nomeMes";


titulo.style.width =
(mes.dias * larguraDia)+"px";


titulo.textContent =
mes.nome;



let dias =
document.createElement("div");


dias.className="dias";



for(let i=1;i<=mes.dias;i++){


let dia =
document.createElement("div");


dia.className="dia";


dia.innerHTML =
"<strong>"+i+"</strong>";



dias.appendChild(dia);


}



bloco.appendChild(titulo);

bloco.appendChild(dias);


cabecalhoMeses.appendChild(bloco);


}



// =====================================
// DESENHAR MAPA
// =====================================


function renderizarMapa(){


gradeReservas.innerHTML="";


criarCabecalho();



hospedagens.forEach(casa=>{


let linha =
document.createElement("div");


linha.className="linha";



for(let dia=1; dia<=meses[mesAtual].dias; dia++){


let celula =
document.createElement("div");


celula.className="celula";



// clique no dia

celula.onclick=function(){


abrirModalReserva(
casa,
dia
);


};



linha.appendChild(celula);


}




// carregar reservas da casa


reservas.forEach(reserva=>{


if(
reserva.casa === casa
){


let entrada =
new Date(reserva.entrada+"T00:00:00");


let saida =
new Date(reserva.saida+"T00:00:00");



let anoAtual = new Date().getFullYear();


let primeiroDiaMes =
new Date(
anoAtual,
mesAtual,
1
);


let ultimoDiaMes =
new Date(
anoAtual,
mesAtual,
meses[mesAtual].dias
);


if(

entrada <= ultimoDiaMes &&

saida > primeiroDiaMes

){

let barra =
criarBarraReserva(reserva);


if(barra){

    linha.appendChild(barra);

}

}
}


});



gradeReservas.appendChild(linha);



});


}




// =====================================
// VERIFICAR MÊS
// =====================================


function mesDaData(data){


return new Date(data).getMonth();


}


// =====================================
// ABRIR MODAL DE RESERVA
// =====================================


function abrirModalReserva(casa,dia){

reservaEditando=null;

document.getElementById("salvarReserva").textContent="Salvar";

casaSelecionada = casa;



let entrada = new Date(
new Date().getFullYear(),
mesAtual,
dia
);



document.getElementById("casaReserva").value =
casa;



document.getElementById("dataEntrada").value =
entrada.toISOString().split("T")[0];



let saida = new Date(entrada);

saida.setDate(
saida.getDate()+1
);



document.getElementById("dataSaida").value =
saida.toISOString().split("T")[0];



document.getElementById("nomeHospede").value="";
document.getElementById("telefoneHospede").value="";
document.getElementById("statusReserva").value="Check-in";



modal.style.display="flex";


}




// =====================================
// FECHAR MODAL
// =====================================


document.getElementById("cancelarReserva")
.onclick=function(){


modal.style.display="none";


};




// =====================================
// SALVAR RESERVA
// =====================================


document.getElementById("salvarReserva")
.onclick=function(){


let dados = {


casa:
document.getElementById("casaReserva").value,


hospede:
document.getElementById("nomeHospede").value,


telefone:
document.getElementById("telefoneHospede").value,


entrada:
document.getElementById("dataEntrada").value,


saida:
document.getElementById("dataSaida").value,


status:
document.getElementById("statusReserva").value


};





if(!dados.hospede){

alert("Digite o nome do hóspede");

return;

}




// EDIÇÃO

if(reservaEditando){



dados.id = reservaEditando.id;



if(verificarConflito(dados)){


alert(
"Já existe outra reserva neste período."
);


return;


}



reservas =
reservas.map(r=>{


if(r.id===dados.id){

return dados;

}


return r;


});



}


// NOVA RESERVA

else{


dados.id = Date.now();



if(verificarConflito(dados)){


alert(
"Já existe outra reserva neste período."
);


return;


}



reservas.push(dados);


}




salvarBanco();


modal.style.display="none";


reservaEditando=null;


document.getElementById("salvarReserva").textContent="Salvar";


renderizarMapa();



};




// =====================================
// SALVAR NO NAVEGADOR
// =====================================


function salvarBanco(){


localStorage.setItem(
"reservas",
JSON.stringify(reservas)
);


}




// =====================================
// VERIFICAR RESERVA DUPLICADA
// =====================================


function verificarConflito(nova){

return reservas.some(r=>{


// ignora a própria reserva ao editar
if(
nova.id &&
r.id === nova.id
){
return false;
}


// somente compara o mesmo quarto
if(r.casa !== nova.casa){
return false;
}



let entradaExistente =
new Date(r.entrada+"T00:00:00");


let checkoutExistente =
new Date(r.saida+"T00:00:00");



let novaEntrada =
new Date(nova.entrada+"T00:00:00");


let novaSaida =
new Date(nova.saida+"T00:00:00");



// Permite nova entrada exatamente no checkout
if(
novaEntrada.getTime() === checkoutExistente.getTime()
){
return false;
}



// Verifica sobreposição real de hospedagem

return (

novaEntrada < checkoutExistente &&

novaSaida > entradaExistente

);


});


}



// =====================================
// CRIAR BARRA DA RESERVA
// =====================================

function criarBarraReserva(reserva){

    let barra = document.createElement("div");

    barra.className="reserva";

    barra.classList.add(reserva.status);



    let entrada = new Date(
        reserva.entrada+"T00:00:00"
    );


    let saida = new Date(
        reserva.saida+"T00:00:00"
    );



    let ano = entrada.getFullYear();



    // PRIMEIRO DIA DO MÊS VISUALIZADO

    let inicioMes = new Date(
        ano,
        mesAtual,
        1,
        0,0,0
    );


    let fimMes = new Date(
        ano,
        mesAtual,
        meses[mesAtual].dias,
        23,59,59
    );


    // SE A RESERVA NÃO PASSA PELO MÊS ATUAL NÃO MOSTRA

    if(
        saida <= inicioMes ||
        entrada > fimMes
    ){

        return null;

    }



    // LIMITA A PARTE VISÍVEL DA RESERVA

    let inicioVisual = entrada < inicioMes 
        ? inicioMes 
        : entrada;


    let fimVisual = saida > fimMes 
        ? fimMes 
        : saida;



    let diaInicio =
    inicioVisual.getDate();



    let quantidadeDias =
    Math.ceil(
        (fimVisual - inicioVisual)
        /
        (1000*60*60*24)
    );



    barra.style.left =
    ((diaInicio-1)*larguraDia)+"px";



    barra.style.width =
    ((quantidadeDias+1)*larguraDia-4)+"px";



    let nome =
    document.createElement("span");


    nome.textContent =
    reserva.hospede;


    barra.appendChild(nome);



    barra.title =
    "Hóspede: "+reserva.hospede+
    "\nEntrada: "+formatarData(reserva.entrada)+
    "\nCheckout: "+formatarData(reserva.saida);



    barra.onclick=function(e){

        e.stopPropagation();

        editarReserva(reserva);

    };



    barra.draggable=true;



    barra.ondragstart=function(e){

        e.dataTransfer.setData(
            "reserva",
            JSON.stringify(reserva)
        );

    };


    return barra;

}



function editarReserva(reserva){

reservaEditando = reserva;


document.getElementById("nomeHospede").value =
reserva.hospede;


document.getElementById("telefoneHospede").value =
reserva.telefone;


document.getElementById("casaReserva").value =
reserva.casa;


document.getElementById("dataEntrada").value =
reserva.entrada;


document.getElementById("dataSaida").value =
reserva.saida;


document.getElementById("statusReserva").value =
reserva.status;


modal.style.display="flex";


document.getElementById("salvarReserva").textContent =
"Atualizar";
let btnExcluir = document.getElementById("btnExcluirReserva");


if(btnExcluir){

btnExcluir.style.display="block";


btnExcluir.onclick=function(){


if(confirm("Excluir esta reserva?")){


reservas = reservas.filter(r=>r.id !== reserva.id);


salvarBanco();


modal.style.display="none";


reservaEditando=null;


renderizarMapa();


}


};


}
}


// =====================================
// MOSTRAR RESERVA
// =====================================


function mostrarReserva(reserva){



let opcao =
confirm(

"Cliente: "+
reserva.hospede+

"\nCasa: "+
reserva.casa+

"\nEntrada: "+
formatarData(reserva.entrada)+

"\nSaída: "+
formatarData(reserva.saida)+

"\n\nExcluir reserva?"

);



if(opcao){


reservas =
reservas.filter(
r=>r.id!==reserva.id
);



salvarBanco();


renderizarMapa();


}



}



// =====================================
// FORMATAR DATA
// =====================================


function formatarData(data){


return new Date(data)
.toLocaleDateString(
"pt-BR"
);


}
// =====================================
// ARRASTAR RESERVA PELO MAPA
// =====================================


// =====================================
// ARRASTAR RESERVA PARA OUTRO APARTAMENTO
// =====================================

gradeReservas.ondragover=function(e){

e.preventDefault();

};



gradeReservas.ondrop=function(e){


e.preventDefault();



let dados =
e.dataTransfer.getData("reserva");



if(!dados)
return;



let reservaMovida =
JSON.parse(dados);



// posição X = dia

let area =
gradeReservas.getBoundingClientRect();


let posicaoX =
e.clientX - area.left;


let novoDia =
Math.floor(
posicaoX / larguraDia
)+1;



if(novoDia < 1)
novoDia=1;



// posição Y = apartamento

let posicaoY =
e.clientY - area.top;



let alturaLinha =
55;



let novaCasaIndex =
Math.floor(
posicaoY / alturaLinha
);



if(novaCasaIndex < 0)
novaCasaIndex=0;



if(novaCasaIndex >= hospedagens.length)
novaCasaIndex =
hospedagens.length-1;



let novaCasa =
hospedagens[novaCasaIndex];




// nova entrada

let novaEntrada =
new Date(
new Date().getFullYear(),
mesAtual,
novoDia
);



// quantidade de noites

let noites =
(
new Date(reservaMovida.saida+"T00:00:00")
-
new Date(reservaMovida.entrada+"T00:00:00")
)
/
(1000*60*60*24);




// nova saída

let novaSaida =
new Date(novaEntrada);


novaSaida.setDate(
novaSaida.getDate()+noites
);



let reservaNova = {


id:
reservaMovida.id,


casa:
novaCasa,


hospede:
reservaMovida.hospede,


telefone:
reservaMovida.telefone,


status:
reservaMovida.status,


entrada:
novaEntrada.toISOString().split("T")[0],


saida:
novaSaida.toISOString().split("T")[0]


};




// verifica conflito

if(verificarConflito(reservaNova)){


alert(
"Este apartamento já possui reserva neste período!"
);


return;


}




// atualiza

reservas =
reservas.map(r=>{


if(r.id===reservaMovida.id){

return reservaNova;

}


return r;


});



salvarBanco();


renderizarMapa();



};





// =====================================
// BOTÃO HOJE
// =====================================


document.getElementById("btnHoje")
.onclick=function(){



let hoje =
new Date();



mesAtual =
hoje.getMonth();



renderizarMapa();



setTimeout(()=>{


document.querySelector(".wrapper")
.scrollLeft =

(
hoje.getDate()
*
larguraDia
)
-300;



},200);



};





// =====================================
// BOTÃO ATUALIZAR
// =====================================


document.getElementById("btnAtualizar")
.onclick=function(){



reservas =
JSON.parse(
localStorage.getItem("reservas")
)
|| [];



renderizarMapa();


};





// =====================================
// BOTÃO NOVA RESERVA
// =====================================


document.getElementById("btnNovaReserva")
.onclick=function(){



let hoje =
new Date();



abrirModalReserva(

hospedagens[0],

hoje.getDate()

);



};


function carregarHospedagensSelect(){

    const select = document.getElementById("casaReserva");

    select.innerHTML = "";

    hospedagens.forEach(casa => {

        let option = document.createElement("option");

        option.value = casa;
        option.textContent = casa;

        select.appendChild(option);

    });

}


// =====================================
// FILTRO DE MÊS
// =====================================


function criarFiltroMes(){


let select =
document.createElement("select");


select.id="filtroMes";



meses.forEach((mes,index)=>{


let opcao =
document.createElement("option");


opcao.value=index;


opcao.textContent =
mes.nome;


select.appendChild(opcao);



});



select.value =
mesAtual;



select.onchange=function(){


mesAtual =
Number(this.value);


renderizarMapa();


};



document.querySelector(".topo")
.appendChild(select);


}




// =====================================
// INICIAR SISTEMA
// =====================================


criarFiltroMes();

carregarHospedagensSelect();
carregarHospedagens();


renderizarMapa();