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
}

function mostar_list_instituicao()
{
	var instituicao_lista = document.getElementById("instituicao_lista");
	instituicao_lista.style.visibility = 'visible';
}

function mostar_list_disciplina()
{
	var disciplina_lista = document.getElementById("disciplina_lista");
	disciplina_lista.style.visibility = 'visible';
}

function mostar_list_material()
{
	var material_lista = document.getElementById("material_lista");
	material_lista.style.visibility = 'visible';
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

function buscar()
{
	var xmlDoc;

	ocultarListas();

	var instituicoes = new Array;
	instituicoes = pegarInstituicoes();

	var disciplinas = new Array;
	disciplinas = pegarDisciplinas();

	var procura = document.getElementById("texto_busca").value;

	var filtro_tipo = 'QUALQUER';
	var material = document.getElementById("didatico").checked;
	var artigo = document.getElementById("artigo").checked;

	if(material)
	{
		filtro_tipo = "MATERIAL DIDATICO"; 
	}
	if(artigo) 
	{
		filtro_tipo = "ARTIGO"; 
	}

	carregarXml(instituicoes, disciplinas, filtro_tipo, procura);
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

function carregarXml(instituicoes, disciplinas, filtro_tipo, procura)
{

	xml=loadXMLDoc("bd.xml");
	//path="/acervo/cadastro/titulo";
	
	var expressao = new Array;
	var inst_path = "";
	var disc_path = "";
	var material_path = "";

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

	if(filtro_tipo  != "QUALQUER")
	{
		material_path = '[tipo="' + filtro_tipo + '"]';
	}

	var path = "/acervo/cadastro" + inst_path + disc_path + material_path + "/titulo";

	var buffer = "";


alert(path);


	buffer = path;
	buffer += "<br/><br/>\n";

	//path="/acervo/cadastro[ies='UTFPR']/titulo|";
	//var path="/acervo/cadastro/ies";
	// code for IE

	if (window.ActiveXObject)
	{
		var nodes=xml.selectNodes(path);

		for (i=0;i<nodes.length;i++)
		{
			//document.write(nodes[i].childNodes[0].nodeValue);
			buffer += "<li>" + nodes[i].childNodes[0].nodeValue + "</li>\n";
		}
	}
	// code for Mozilla, Firefox, Opera, etc.
	else if (document.implementation && document.implementation.createDocument)
	{
		var nodes=xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null);
		var result=nodes.iterateNext();

		while (result)
		{
			buffer += "<li>" + result.childNodes[0].nodeValue + "</li>\n";
			result=nodes.iterateNext();
		}
	}

	var resultado = document.getElementById("resultado");
	resultado.innerHTML = buffer;
}

