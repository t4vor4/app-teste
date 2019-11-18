import React, { Component } from 'react';
import './App.css';
import InputMask from 'react-input-mask';
import axios from 'axios';

const $ = el => document.querySelector(el);

const url = `./objetoteste.json`;

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      infos: {},
      actualInfo: {},
      paginaAtual: 'inicio',
      value: 'R$ 0,00'
    }

    this.currency = this.currency.bind(this);
    this.barraNav = this.barraNav.bind(this);
    this.setPagina = this.setPagina.bind(this);
    this.cbAcumulado = this.cbAcumulado.bind(this);
    this.useList = this.useList.bind(this);
    this.setNewUser = this.setNewUser.bind(this);
    this.consultUser = this.consultUser.bind(this);
    this.cadastrarCompra = this.cadastrarCompra.bind(this);
    this.onChange = this.onChange.bind(this);
    this.conversor = this.conversor.bind(this);
    this.confirmaCadastro = this.confirmaCadastro.bind(this);
    

  }

  componentDidMount() {

    const storage = !!localStorage.myDearTest17112019 && (localStorage.getItem('myDearTest17112019'))

    console.log(this.state.actualInfo)

    if (!!storage) {
      this.setState({ infos: JSON.parse(storage) })
      console.log(JSON.parse(storage))
    }
    else {
      axios.get(url)
        .then(res => res.data)
        .then(resp => {
          console.log(resp)
          this.setState({ infos: resp })
          localStorage.setItem('myDearTest17112019', JSON.stringify(this.state.infos))
        })
    }


  }

  conversor(el) {
    localStorage.setItem('myDearTest17112019', JSON.stringify(el))
  }

  setNewUser() {
    const users = this.state.infos;
    const nUser = {}
    nUser.email = $('#cadastro-email').value;
    nUser.senha = $('#pass2').value;
    nUser.cpf = $('#cpf').value;
    nUser.compras = []

    if (nUser.email.indexOf('@') === -1) {
      alert('E-mail invalido')
      return
    } else {
      const findDot = nUser.email.split('@')
      if (findDot[1].indexOf('.') === -1) {
        alert('E-mail invalido 2')
        return
      }
    }

    if (nUser.senha.length < 4) {
      alert('Sua senha deve ter no mínimo 4 characteres')
      return
    }

    if (nUser.cpf === '' || nUser.cpf.indexOf('_') > -1) {
      alert('Por favor, preencha seu CPF corretamente')
      return
    }

    for (let i = 0; i < users.length; i++) {
      if (nUser.email === users[i].email) {
        alert('E-mail já cadastrado.')
        return
      }
      if (nUser.cpf === users[i].cpf) {
        alert('CPF já cadastrado.')
        return
      }
    }

    users.push(nUser)

    this.setState({
      actualInfo: users,
      paginaAtual: 'listagem'
    })

    this.conversor(users)

  }

  consultUser() {
    const users = this.state.infos;
    const cUser = {};
    cUser.email = $('#login-email').value;
    cUser.senha = $('#pass').value;
    let validator;

    console.log(users)

    if (cUser.email.indexOf('@') === -1) {
      alert('E-mail invalido')
      return
    } else {
      const findDot = cUser.email.split('@')
      if (findDot[1].indexOf('.') === -1) {
        alert('E-mail invalido 2')
        return
      }
    }
    if (cUser.senha === '') {
      alert('Senha inválida')
      return
    }

    for (let i = 0; i < users.length; i++) {
      if (cUser.email === users[i].email) {
        if (cUser.senha === users[i].senha) {
          validator = 1
          this.setState({
            actualInfo: users[i],
            paginaAtual: 'listagem'
          })
        }
      }
    }

    !validator && (alert('Usuário ou senha não encontrado.'))

  }

  cadastrarCompra() {
    const compra = {}
    const cbPercent = 0.05;
    const $users = this.state.infos;
    const $user = this.state.actualInfo

    const valor = !!this.state.value ? this.state.value.replace('R$ ', '').replace(',', '') : null;
    compra.codigo = $('#cadCode').value;
    compra.data = ($('#cadData').value).replace(/-/g, '/');


    if (!compra.codigo) { alert('Insira um código válido'); return }
    if (!valor) { alert('Insira um valor de compra'); return }
    if (!compra.data) { alert('Escolha uma data válida'); return }

    if (!!$user.compras.length) {
      for (let i = 0; i < $user.compras.length; i++) {
        if ($user.compras[i].codigo === compra.codigo) { alert('Este código já existe'); return }
      }
    }

    compra.valor = valor;
    compra.cbPercent = cbPercent;
    compra.cbValor = Math.floor(valor * cbPercent);
    compra.statusCadastro = "validacao";

    $user.compras.push(compra)

    if (!!$users.length) {
      for (let i = 0; i < $users.length; i++) {
        if ($users[i].cpf === $user.cpf) $users[i] = $user
      }
    }

    this.conversor($users)

    alert('Compra cadastrada com sucesso!')

    $('#cadValor').value = '';
    $('#cadCode').value = '';
    $('#cadData').value = '';

  }

  cbAcumulado() {

    const info = this.state.actualInfo;

    if (!!info.compras && !!info.compras.length) {

      const somando = (a, b) => parseInt(a) + parseInt(b);

      const limpaValores = el => el.statusCadastro !== 'reprovado' ? el.cbValor : 0

      const total = info.compras.map(limpaValores).reduce(somando)

      const totalArr = (((total*0.01).toFixed(2)).toString()).split('.')
      
      console.log(totalArr)
      
      if (!!totalArr) {
        return (
          <React.Fragment>
            <h3 className="subtitle">Valor total do Cashback acumulado até a presente data</h3>
            <div className="text text--big"><sup>R$</sup>{totalArr[0]}<small>,{totalArr[1]}</small></div>
          </React.Fragment>
        )
      }
      else {
        return (
          <h3 className="subtitle">Não há valores disponíveis</h3>
        )
      }

    }

    else {
      return (
        <h3 className="subtitle">Não há valores disponíveis</h3>
      )
    }

  }

  currency(valor) {
    const newVal = 'R$ ' + (((valor * 0.01).toFixed(2)).replace('.', ','))
    return newVal
  }

  setPagina(valor) {
    this.setState({ paginaAtual: valor })
  }

  barraNav() {
    return (
      <div className={`nav ${this.state.paginaAtual}`}>
        <button data-page="listagem" onClick={_ => this.setState({ paginaAtual: 'listagem' })}>Lista de Compras</button>
        <button data-page="cadastroCompras" onClick={_ => this.setState({ paginaAtual: 'cadastroCompras' })}>Cadastro de Compras</button>
        <button data-page="cshAcumulado" onClick={_ => this.setState({ paginaAtual: 'cshAcumulado' })}>Cashback acumulado</button>
      </div>
    )
  }

  confirmaCadastro(string) {
    if(string === 'validacao') {
      return (
        <select name="select">
          <option value="" >Validação</option> 
          <option value="aprovado" >Aprovado</option>
          <option value="reprovado">Reprovado</option>
        </select>
      )
    }
    if(string === 'aprovado') return 'Aprovado'
    if(string === 'reprovado') return 'Reprovado'
  }

  useList() {
    
    const $users = this.state.infos;
    const $user = this.state.actualInfo

    // console.log(this.state.infos)

    // console.log($user)

    const listaCompras = !!$user.compras ? $user.compras : null

    let teste = []

    if (!!listaCompras && !!listaCompras.length) {
      for (let i = 0; i < listaCompras.length; i++) {
        const el = listaCompras[i];
        const escolha = event => {
          $user.compras[i].statusCadastro = event.target.value;

          this.setState({actualInfo: $user})

          for(let i in $users) {
            if($users[i].cpf === $user.cpf) {
              $users[i] = $user;
              this.setState({infos: $users})
              localStorage.setItem('myDearTest17112019', JSON.stringify(this.state.infos))
            }
          }

        }
        teste.push(
          <tr className={`lista_item ${el.statusCadastro}`} key={i}>
            <td className="codigo">{el.codigo}</td>
            <td className="valor">{this.currency(el.valor)}</td>
            <td className="data">{el.data}</td>
            <td className="cbPercent">{el.cbPercent}</td>
            <td className="cbValor">{this.currency(el.cbValor)}</td>
            <td className="statusCadastro">{
              el.statusCadastro === 'aprovado' ? ('Aprovado') : el.statusCadastro === 'reprovado' ? ('Reprovado') : (
                <select name="select" onChange={escolha}>
                  <option value="" >Validação</option> 
                  <option value="aprovado" >Aprovado</option>
                  <option value="reprovado">Reprovado</option>
                </select>
            )}</td>
          </tr>
        )
      }



      return (
        <table className="lista">
          <thead>
            <tr className="lista_item lista_item--topo">
              <th className="codigo">Código</th>
              <th className="valor">Valor da Compra</th>
              <th className="data">Data</th>
              <th className="cbPercent">% do Cashback</th>
              <th className="cbValor">Valor do Cashback</th>
              <th className="statusCadastro">Status</th>
            </tr>
          </thead>
          <tbody>
            {teste}
          </tbody>
        </table>
      )
    }
    else {
      return (
        <h3 className="info info--negative">'Não existem compras ainda.'</h3>
      )
    }


  }

  onChange = (event) => {
    let valor = event.target.value

    valor = valor.replace('R$ ', '')

    valor = valor.replace(',', '')

    console.log(valor.length)

    const y = valor


    y.length === 0 && (valor = '')


    y.length > 0 && (valor = `R$ ${((y * 0.01).toFixed(2)).replace('.', ',')}`)

    console.log(valor)

    this.setState({
      value: valor
    });
  }


  render() {

    let paginaAtual = this.state.paginaAtual

    return (
      <div className={`${this.state.paginaAtual} content`}>
        {
          paginaAtual === 'inicio' && (
            <React.Fragment>
              <h1>Olá, bem vindo ao aplicativo teste</h1>
              <div className="form form_cadastro">
                <h3>Cadastre-se</h3>
                <span className="cont cont--cadastro">
                  <label htmlFor="cadastro-email">E-mail</label>
                  <input type="email" id="cadastro-email" pattern=".+@globex.com" size="30" required />
                </span>
                <span className="cont cont--senha">
                  <label htmlFor="cadastro-senha">Senha</label>
                  <input type="password" id="pass2" name="password" minLength="4" required />
                </span>
                <span className="cont cont--cpf">
                  <label htmlFor="cadastro-cpf">CPF</label>
                  <InputMask {...this.props} mask="999.999.999-99" maskChar="_" id="cpf" />
                </span>
                <button className="cadastro-entrar" onClick={this.setNewUser} value={this.state.value}>Cadastrar</button>
              </div>
              <div className="form form_login">
                <h3>Já sou cadastrado</h3>
                <span className="cont cont--login">
                  <label htmlFor="login-email">E-mail</label>
                  <input type="email" id="login-email" pattern=".+@globex.com" size="30" required />
                </span>
                <span className="cont cont--senha">
                  <label htmlFor="login-senha">Senha</label>
                  <input type="password" id="pass" name="password" minLength="4" required />
                </span>
                <button className="login-entrar" onClick={this.consultUser} >Entrar</button>
              </div>
            </React.Fragment>
          )
        }
        {
          paginaAtual === 'listagem' && (
            <React.Fragment>
              {this.barraNav()}
              <h1>Listagem de compras</h1>
              <div className="cont_table">
                {this.useList()}
              </div>
            </React.Fragment>
          )
        }
        {
          paginaAtual === 'cadastroCompras' && (
            <React.Fragment>
              {this.barraNav()}
              <h1>Cadastro de Compra</h1>
              <ul className="cadastro">
                <li className="cadastro_item cadastro_item--topo">
                  <span className="codigo">
                    <label>Código</label>
                    <input type="text" id="cadCode" />
                  </span>
                  <span className="valor">
                    <label>Valor da Compra</label>
                    <input type="text" id="cadValor" min="1" onChange={this.onChange} value={this.state.value} />
                    {/* <InputMask {...this.props} mask="R$ 9999999" maskChar="" id="cadValor" /> */}
                  </span>
                  <span className="data">
                    <label>Data</label>
                    <input type="date" id="cadData" />
                  </span>
                </li>
                <li className="cadastro__button_cont">
                  <button className="button_cont__cadastrar" id="cadastroCompra" onClick={this.cadastrarCompra}>Cadastrar</button>
                </li>
              </ul>
            </React.Fragment>
          )
        }
        {
          paginaAtual === 'cshAcumulado' && (
            <React.Fragment>
              {this.barraNav()}
              <h1>Cashback acumulado</h1>
              {this.cbAcumulado()}
            </React.Fragment>
          )
        }
      </div>

    );
  }

}

export default App;

