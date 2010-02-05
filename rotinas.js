window.onload = function()
{
	var instituicao_botao = document.getElementById("instituicao_botao");
	var disciplina_botao = document.getElementById("disciplina_botao");
	var material_botao = document.getElementById("material_botao");
	var busca_botao = document.getElementById("busca_botao");
	instituicao_botao.onclick = mostar_list_instituicao;
	disciplina_botao.onclick = mostar_list_disciplina;
	material_botao.onclick = mostar_list_material;
	busca_botao.onclick = buscar;
	alert("Para realizar a busca é necessário CLICAR em Buscar");
}

function mostar_list_instituicao()
{
	var instituicao_lista = document.getElementById("instituicao_lista");
	if(instituicao_lista.style.visibility == 'hidden')
	{
		instituicao_lista.style.visibility = 'visible';
	}
	else
	{
		instituicao_lista.style.visibility = 'hidden';
	}
}

function mostar_list_disciplina()
{
	var disciplina_lista = document.getElementById("disciplina_lista");
	if(disciplina_lista.style.visibility == 'hidden')
	{
		disciplina_lista.style.visibility = 'visible';
	}
	else
	{
		disciplina_lista.style.visibility = 'hidden';
	}
}

function mostar_list_material()
{
	var material_lista = document.getElementById("material_lista");
	if(material_lista.style.visibility == 'hidden')
	{
		material_lista.style.visibility = 'visible';
	}
	else
	{
		material_lista.style.visibility = 'hidden';
	}
}

function ocultarListas()
{
	var instituicao_lista = document.getElementById("instituicao_lista");
	instituicao_lista.style.visibility = 'hidden';
	var disciplina_lista = document.getElementById("disciplina_lista");
	disciplina_lista.style.visibility = 'hidden';
	var material_lista = document.getElementById("material_lista");
	material_lista.style.visibility = 'hidden';
}

function pegarInstituicoes()
{
	instituicoesSelecionadas = new Array;
	var instituicoes = document.getElementsByName("instituicoes");

	for (var i = 0; i < instituicoes.length; i++)
	{
		if(instituicoes[i].checked == true)
		{
			instituicoesSelecionadas.push(instituicoes[i].value);
		}
	}
	return instituicoesSelecionadas;
}

function pegarDisciplinas()
{
	disciplinasSelecionadas = new Array;
	var disciplinas = document.getElementsByName("disciplinas");

	for (var i = 0; i < disciplinas.length; i++)
	{
		if(disciplinas[i].checked == true)
		{
			disciplinasSelecionadas.push(disciplinas[i].value);
		}
	}
	return disciplinasSelecionadas;
}

function pegarMateriais()
{
	materiaisSelecionados = new Array;
	var materiais = document.getElementsByName("materiais");

	for (var i = 0; i < materiais.length; i++)
	{
		if(materiais[i].checked == true)
		{
			materiaisSelecionados.push(materiais[i].value);
		}
	}
	return materiaisSelecionados;
}

function buscar()
{
	var xmlDoc;
	
	ocultarListas();

	var instituicoes = new Array;
	instituicoes = pegarInstituicoes();

	var disciplinas = new Array;
	disciplinas = pegarDisciplinas();

	var materiais = new Array;
	materiais = pegarMateriais();

	var procura = document.getElementById("texto_busca").value;

	carregarXml(instituicoes, disciplinas, materiais, procura);
}

function loadXMLDoc(dname)
{
	if (window.XMLHttpRequest)
	{
		xhttp=new XMLHttpRequest();
	}
	else
	{
		xhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhttp.open("GET",dname,false);
	xhttp.send("");
	return xhttp.responseXML;
}

function carregarXml(instituicoes, disciplinas, materiais, procura)
{
	
	xml=loadXMLDoc("bd.xml");
		
	var expressao = new Array;
	var inst_path = "";
	var disc_path = "";
	var material_path = "";
	var procura_path = "";

	if(instituicoes.length > 0)
	{
		var inst = new Array;
		for( var i = 0; i < instituicoes.length; i++)
		{
			inst.push('ies="' + instituicoes[i] + '"');
		}

		inst_path = "[" + inst.join(" or ") + "]";
	}

	if(disciplinas.length > 0)
	{
		var disc = new Array;
		for( var i = 0; i < disciplinas.length; i++)
		{
			disc.push('disciplina="' + disciplinas[i] + '"');
		}

		disc_path = "[" + disc.join(" or ") + "]";
	}

	if(materiais.length > 0)
	{
		var material = new Array;
		for( var i = 0; i < materiais.length; i++)
		{
			material.push('tipo="' + materiais[i] + '"');

		}

		material_path = "[" + material.join(" or ") + "]";
	}
	

	var path = "/acervo/cadastro" + inst_path + disc_path + material_path + procura_path + "/id";
	
	var buffer = "";

	buffer = path;
	buffer += "<br/><br/>\n";

	buffer += procura
	buffer += "<br/><br/>\n";


	// code for IE

	if (window.ActiveXObject)
	{
	
		var nodes=xml.selectNodes(path);
		
		for (i=0;i<nodes.length;i++)
		{
		
			//document.write(nodes[i].childNodes[0].nodeValue);
			//buffer += "<li>" + nodes[i].childNodes[0].nodeValue + "</li>\n";
			resultado[i] = nodes[i].childNodes[0].nodeValue;
		}
	}
	// code for Mozilla, Firefox, Opera, etc.
	else if (document.implementation && document.implementation.createDocument)
	{
		var nodes=xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null);
		var result=nodes.iterateNext();
		resultado = new Array;
		var i = 0;
		while(result)
		{

			//buffer += "<li>" + result.childNodes[0].nodeValue + "</li>\n";
			resultado[i] = result.childNodes[0].nodeValue;
			i++;
			result=nodes.iterateNext();
		}
		busca_arquivo(resultado);
	}

var resultado = document.getElementById("resultado");
resultado.innerHTML = buffer;
}

/*function loadIndex() {

	if (document.implementation && document.implementation.createDocument) {
		xmlDoc = document.implementation.createDocument("", "", null);
		xmlDoc.load("bd.xml");
	}

	else if (window.ActiveXObject) {
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = "false";
		xmlDoc.load("bd.xml");

	}
} */
function array_search(busca,array){
   
    for(var i in array){
        if(array[i]==busca){return i;}    
    }
    return false;
}

function busca_arquivo(resultado) {

	
	xmlDoc=loadXMLDoc("bd.xml");		
// Limpa a Pesquisa Anterior //
	

	  var tabela = document.getElementById('tabela');
	 while ( tabela.rows.length > 1 ){
		tabela.deleteRow(1);
}

// Vetores para os Campos de Pesquisa //
	
	var procura = document.getElementById("texto_busca").value;
	
	cadastro = new Array;
	titulo = new Array;
	autor = new Array;
	disciplina = new Array;
	tipo = new Array;
	codigo = new Array;
	ies = new Array;
	ind = new Array;
	
	
	filtrados = new Array;
	filtrados = resultado;
	document.getElementById("direita").style.backgroundImage="url(imagens/fundo_resultado.jpg)";
	document.getElementById("direita").style.backgroundRepeat = "repeat-y";

// Relaciona os Vetores com as Tags XML //
	
	cadastro = xmlDoc.getElementsByTagName("cadastro");
	titulo = xmlDoc.getElementsByTagName("titulo");
	autor = xmlDoc.getElementsByTagName("autor");
	disciplina = xmlDoc.getElementsByTagName("disciplina");
	tipo = xmlDoc.getElementsByTagName("tipo");
	codigo = xmlDoc.getElementsByTagName("codigo");
	ies = xmlDoc.getElementsByTagName("ies");
	ind = xmlDoc.getElementsByTagName("id");

		alert(cadastro);

// Verifica se existem valores nas tags XML que coincidem com o termo Pesquisado //
	
	titulos = new Array, autores = new Array, disciplinas = new Array, tipos = new Array, codigos = new Array, universidades = new Array, indices = new Array;
		
	if (procura.length < 2) {
		alert("Entre com Mais De Dois Caracteres!");
	} else {
		for (var i=0;i<cadastro.length;i++) {

			var tit = titulo[i].lastChild.nodeValue;
			var aut = autor[i].lastChild.nodeValue;
			var dis = disciplina[i].lastChild.nodeValue;
			var tip = tipo[i].lastChild.nodeValue;
			var cod = codigo[i].lastChild.nodeValue;
			var uni = ies[i].lastChild.nodeValue;
			var uni = ind[i].lastChild.nodeValue;
			
			var verifica = array_search(uni, filtrados);
			if(verifica){	
			var reg = new RegExp(procura,"i");
			if ( tit.match(reg) || aut.match(reg) || dis.match(reg) || tip.match(reg) || uni.match(reg) || cod.match(reg) != null) {
				titulos.push(titulo[i]);
				autores.push(autor[i]);
				disciplinas.push(disciplina[i]);
				tipos.push(tipo[i]);
				universidades.push(ies[i]);
				codigos.push(codigo[i]);
				indices.push(ind[i]);
				
			}
		}
		}
// Envia os termos encontrados para a Função Mostra_Resultado //
	mostra_resultados(titulos, autores, disciplinas, tipos, universidades, codigos, procura, indices);
	}
}


// Formata e Mostra os Resultados pra o Usuário //
function mostra_resultados(titulos, autores, disciplinas, tipos, universidades, codigos, procura, indices) {


item_titulo = new Array, item_autor = new Array, item_disciplina = new Array, item_tipo = new Array, item_universidade = new String, item_codigo = new String;

	if (titulos.length > 0) {
	
		document.getElementById("tabela").style.display="table";
		document.getElementById("esquerda").style.display="inline"
		
		//var id_resultado = document.getElementById("resultado");
		var id_tabela = document.getElementById("tabela");
		//var header = document.createElement("h5");
		//var encontrado = document.createTextNode("Arquivos Encontrados com: "+procura);
		//id_resultado.appendChild(header);
		//header.appendChild(encontrado);
			
		for (var i=0;i<titulos.length;i++) {
			
	
			var linha = document.createElement("<tr>");
			var coluna1 = document.createElement("<td>");
			var coluna2 = document.createElement("<td>");
			var coluna3 = document.createElement("<td>");
			var coluna4 = document.createElement("<td>");
			var coluna5 = document.createElement("<td>");
			var link = document.createElement("<a>");
			
			alert(titulo[i]);
				
			item_titulo[i] = document.createTextNode(titulos[i].lastChild.nodeValue);
			item_autor[i] = document.createTextNode(autores[i].lastChild.nodeValue);
			item_disciplina[i] = document.createTextNode(disciplinas[i].lastChild.nodeValue);
			item_tipo[i] = document.createTextNode(tipos[i].lastChild.nodeValue);
			item_universidade[i] = document.createTextNode(universidades[i].lastChild.nodeValue);
			item_codigo[i] = document.createTextNode(codigos[i].lastChild.nodeValue);
			var arquivo = codigos[i].lastChild.nodeValue;
			var mat = disciplinas[i].lastChild.nodeValue;
			var materia = mat.toLowerCase()
			var endereco = "materias/"+ materia + "/" + arquivo + ".pdf";
	

			link.setAttribute("href", endereco);
			link.appendChild(item_titulo[i]);
			coluna1.appendChild(link);
			coluna2.appendChild(item_autor[i]);
			coluna3.appendChild(item_disciplina[i]);
			coluna4.appendChild(item_tipo[i]);
			coluna5.appendChild(item_universidade[i]);
			linha.appendChild(coluna1);
			linha.appendChild(coluna2);
			linha.appendChild(coluna3);
			linha.appendChild(coluna4);
			linha.appendChild(coluna5);
			id_tabela.appendChild(linha);

		}
			

	} else {
		
		document.getElementById("tabela").style.display="none";
		var nao_encontrado = ("Não Foram Encontrados Arquivos com o Nome: "+procura +"!");
		alert(nao_encontrado);
	}
}

