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

  movementsDates: [
    '2022-10-18T21:31:17.178Z',
    '2022-10-23T07:42:02.383Z',
    '2022-10-28T09:15:04.904Z',
    '2022-11-01T10:17:24.185Z',
    '2022-11-08T14:11:59.604Z',
    '2022-11-21T14:43:26.374Z',
    '2022-11-23T18:49:59.371Z',
    '2022-11-25T12:01:20.894Z'],
    currency: 'BRL',
    locale: 'pt-BR', // pt-BR
};

const account2 = {
  owner: 'Lucimar Soares Inácio',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2022-01-01T13:15:33.035Z',
    '2022-01-30T09:48:16.867Z',
    '2022-04-25T06:04:23.907Z',
    '2022-05-10T14:18:46.235Z',
    '2022-05-15T16:33:06.386Z',
    '2022-11-21T14:43:26.374Z',
    '2022-11-23T18:49:59.371Z',
    '2022-11-25T12:01:20.894Z'],
    currency: 'BRL',
    locale: 'pt-BR', // pt-BR
};

// const account3 = {
//   owner: 'Lucimar Soares Inácio',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Catarina da Silva',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

const accounts = [account1, account2];

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

// Funções
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  
  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Hoje';
  // if (daysPassed === 1) return 'Ontem';
  // if (daysPassed <= 7) return `${daysPassed} dias atrás`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

// Atualiza interface depositos e saques
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposito' : 'saque';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    // const formattedMov = new Intl.NumberFormat(acc.locale, {
    //   style: 'currency',
    //   currency: acc.currency,
    // }).format(mov);

    // const html = `
    //   <div class="movements__row">
    //     <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    //     <div class="movements__date">${displayDate}</div>
    //     <div class="movements__value">${formattedMov}</div>
    //   </div>`;

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
      </div>`;
      containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Calcula saldo
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;
};

// Calcula resumo
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;

  const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;

  const interest = acc.movements
   .filter(mov => mov > 0)
   .map(deposit => (deposit * acc.interestRate) / 100)
   .filter((int, i, arr) => {
     return int >=1 })
     .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
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
  displayMovements(acc);

  // Display saldo
  calcDisplayBalance(acc);

  // Display resumo
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min= String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each call, print the remaining time to UI

    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Entre com sua conta';
      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time--;
  };
  // Set time to 5 minutes
  let time = 120;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// Event handler - Manipulador de eventos
let currentAccount, timer;

// Fake always logged in - Simula login
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  // Previne comportamento padrão do formulário
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  if(currentAccount?.pin === +inputLoginPin.value) {
    // Exibe mensagem de boas vindas
    labelWelcome.textContent = `Bem vindo, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    // Cria data e hora atual - Por API
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      //weekday: 'long',
    };

    //const locale = navigator.language;
  labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);

    // Cria data e hora atual - Por código
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const minutes = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;

    // Limpa campos de login
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

   // Atualiza interface
   updateUI(currentAccount);
  }else {
    alert('Usuário ou senha inválidos!');
  }
});

// Transferência
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +(inputTransferAmount).value;
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

    // Adicionando data da transferência
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());


    // Atualiza interface
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  } else {
    alert('Erro ao transferir - Saldo insufieciente ou usuário inválido!'); 
  }
});

// Solicitação de empréstimo
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout (function () {
      // Adiciona movimento
      currentAccount.movements.push(amount);

      // Adicionando data do empréstimo
      currentAccount.movementsDates.push(new Date().toISOString());

      // Atualiza interface
      updateUI(currentAccount)

      // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});


// Deletar conta
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  
  if(inputCloseUsername.value === currentAccount.username && +(inputClosePin.value) === currentAccount.pin)
  {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);

    console.log(index);

    // Deleta conta
    accounts.splice(index, 1);

    // Oculta interface
    containerApp.style.opacity = 0;
    console.log(accounts);

  }else {
    alert('Usuário ou senha inválidos!');
  }
  inputCloseUsername.value = inputClosePin.value = '';
  labelWelcome.textContent = 'Inicie sessão para começar';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

//displayMovements = function (acc, sort = false)

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
