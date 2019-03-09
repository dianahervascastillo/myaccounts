/* global */
'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import Moment from 'react-moment'

// Data
import AccountsData from './accountsapi/accountsApi.json'

// Images
import Lloyds from './img/Favicon_lloyds.svg'
import Amex from './img/Favicon_amex.svg'

// Css
import './css/common.css'

class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {activeAccount: null, activeId: null}
    this.selectAccount = this.selectAccount.bind(this)
  }
  componentWillMount() {
    this.setState({activeAccount: 0})
  }
  selectAccount (index) {
    this.setState({activeAccount: index})
  }
  renderCurrency (currency){
    if(currency < 0){
      return <span className='negative'>-£{Math.abs(currency)}</span>
    } else{
      return <span className='positive'>£{Math.abs(currency)}</span>
    }
  }
  renderDates (date){
    return <Moment format="DD/MM/YYYY">{date}</Moment>
  }
  renderAvatar (account){
    if ( account.provider.title.includes('Lloyds') ){
      return  <img src={`${Lloyds}`} alt={account.provider.title}/>
    } else{
      return <img src={`${Amex}`} alt={account.provider.title}/>
    }
  }
  renderAccountNumberOrCardNumber (activeAccount) {
    if ( activeAccount.provider.description.includes('card') ){
      return <span>{activeAccount.provider.card_number}</span>
    } else{
      return <span>{activeAccount.provider.account_number} / {activeAccount.provider.sort_code}</span>
    }
  }

  render () {
    const activeAccount = AccountsData.accounts[this.state.activeAccount]
    const activeAccountTransactions = activeAccount.transactions
    const dates = activeAccountTransactions.map(transactionDate => transactionDate.date)
    const uniqueDates = Array.from(new Set(dates))

    return (
      <main className='container'>
        <div className='sidebar'>
          <div className='accounts-list'>
            <h1>Account</h1>
            <ul>
              {AccountsData.accounts.map((account, index) => {
                return <li key={`account-${account.id}`}>
                  <button id={index} className={`button--account ${index === this.state.activeAccount? "active": ""}`} type='button' onClick={() => { this.selectAccount(index) }}>
                    <div className='button__wrapper'>
                      <div className='account-id'>
                        <span className="account-img">{this.renderAvatar(account)}</span>
                        <h2>{account.provider.title}<small>{account.provider.description}</small></h2>
                      </div>
                      <div className='account-status'>
                        {this.renderCurrency(account.balance.amount)}
                      </div>
                    </div>
                  </button>
                </li>
              })}
            </ul>
          </div>
        </div>
        <div className='content accounts-movements'>
            <section className={`account-detail`}>
                <header>
                  <div className='account-detail__balance'>
                    <h1>{this.renderCurrency(activeAccount.balance.amount)}</h1>
                    <p>Available Balance</p>
                  </div>
                  <div className='account-detail__info'>
                    <h2 className='account-detail__name'>{activeAccount.provider.title}</h2>
                    <p className='account-detail__desc'>{activeAccount.provider.description}</p>
                    <p className='account-detail__number'>{this.renderAccountNumberOrCardNumber(activeAccount)}</p>
                  </div>
                </header>
                    {uniqueDates.map((date, index) => {
                      return <section key={`transactions-${index}`} className='transactions'>
                          <h3>{this.renderDates(date)}</h3>
                          <ul className='transactions-list'>
                            {activeAccountTransactions.filter( (transaction) =>  { // filter first for friends
                              return transaction.date === date // returns a new array
                            }).map( (transaction) => {  // map the new array to list items
                              return <li key={transaction.id} className='transaction'>
                                  <p className='transaction__name'>{transaction.description} <small>{transaction.category_title}</small></p>
                                  <span className='transaction__figure'>
                                    {this.renderCurrency(transaction.amount.value)}
                                    </span>
                                </li>
                            })}
                          </ul>
                      </section>
                    })}
            </section>
        </div>
      </main>
    )
  }
}

ReactDOM.render(<Main />, document.getElementById('app'))