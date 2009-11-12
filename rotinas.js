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
	//path="/acervo/cadastro/titulo";
	
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

/*
	if(procura != "")
	{
		procura_path = '[matches(titulo, "[a-zA-Z ]{1,}", "sim")]';
	}
*/
	var path = "/acervo/cadastro" + inst_path + disc_path + material_path + procura_path + "/titulo";

	alert(path);

	var buffer = "";

	buffer = path;
	buffer += "<br/><br/>\n";

	buffer += procura
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

