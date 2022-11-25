'use strict';//elimina alguns erros silenciosos que passariam batido do JavaScript e os faz emitir erros

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Dados de usuários
const account1 = {
  owner: 'Rosimar Soares Coimbra',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Sérgio Coimbra Alves',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Lucimar Soares Inácio',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Catarina da Silva',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Atualiza interface depositos e saques
const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposito' : 'saque';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__value">R$ ${mov}</div>
      </div>`;
      containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `R$ ${incomes}`;

  const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `R$ ${Math.abs(out)}`;

  const interest = acc.movements
   .filter(mov => mov > 0)
   .map(deposit => (deposit * acc.interestRate) / 100)
   .filter((int, i, arr) => {
     return int >=1 })
     .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `R$ ${interest}`;
}

// Cria contas de usuários - pegando a primeira letra de cada nome e sobrenome
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
   acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  })
};
createUsernames(accounts);

// Atualiza interface
const updateUI = function (acc) {
  // Display movementos
  displayMovements(acc.movements);

  // Display saldo
  calcDisplayBalance(acc);

  // Display resumo
  calcDisplaySummary(acc);
};

// Event handler - Manipulador de eventos
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Previne comportamento padrão do formulário
  e.preventDefault();
  //console.log('Login');
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);

  if(currentAccount?.pin === Number(inputLoginPin.value)) {
    // Exibe mensagem de boas vindas
    labelWelcome.textContent = `Bem vindo, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    // Limpa campos de login
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

   // Atualiza interface
   updateUI(currentAccount);
  }else {
    alert('Usuário ou senha inválidos!');
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Fazendo a transferência
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Atualiza interface
    updateUI(currentAccount);
  } else {
    alert('Erro ao transferir - Saldo insufieciente ou usuário inválido!'); 
  }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
  ['BRL', 'Real brasileiro'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const movementsDescriptions = movements.map((mov, i) => 
  `Moviment ${i + 1}: Você ${mov > 0 ? 'depositou' : 'sacou'} ${Math.abs(mov)}`
);

//console.log(movementsDescriptions);