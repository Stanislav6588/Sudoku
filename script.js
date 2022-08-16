'use strict'

 class Sudoku{
	 constructor({gamePlaceList, info, iconLevel, icon}){
		this.gamePlaceList = document.querySelector(gamePlaceList);
		this.info = document.querySelector(info);
		this.iconLevel = document.querySelector(iconLevel);
		this.icon = document.querySelector(icon);
		this.url = '/sudoku.json';
		this.coord = {};
		this.flag = false;
		this.level = 1;
	 }

	 sendpost(){
		 fetch(this.url, {
			 method: 'GET',
			 mode: 'cors',
			 credentials: 'include',
			 headers:{
				 'Content-Type':'application/json'
			 },
			 body: JSON.stringify()
		 })
		 .then((response) => {
			 if(response.status !== 200){
				 throw new Error('error');
			 }
			 return response.json();
		 })
		 .then((data) => {
			 let date = data.filter(i => i.level == this.level);
			 this.open(date);
		 })
		 .catch((error) => console.log(error))
	 }

	 open(data){
		if(data[0].level == 1){
			this.gamePlaceList.classList.remove('fourUl');
			this.gamePlaceList.classList.add('threeUl');
			this.icon.classList.remove('fourIcon');
			this.icon.classList.add('threeIcon');
		}
		if(data[0].level == 2){
			this.gamePlaceList.classList.remove('threeUl');
			this.gamePlaceList.classList.add('fourUl');
			this.icon.classList.remove('threeIcon');
			this.icon.classList.add('fourIcon');
		}
		let random = Math.floor(Math.random() * 9) + 1;
		this.defaultSettings(data[random]);
	 }

	 defaultSettings(data){
		data.icon.forEach((i) => {
			this.icon.insertAdjacentHTML('beforeend', `
			<div class="iconItem"><img src="${i}" ></div>
			` )
		})
		data.place.forEach((i) => {
			if(i == 0){
				this.gamePlaceList.insertAdjacentHTML('beforeend', `
				<li></li>
				`)
			}
			else {
				this.gamePlaceList.insertAdjacentHTML('beforeend', `
				<li><img src="image/${i}.${this.level}.png"></li>
				`)
			}
		})
	}

clearItems(){
	let list = document.querySelector('.gamePlaceList');
	let icon = document.querySelector('.icon');
	list.innerHTML = '';
	icon.innerHTML = '';
}

move(){
	this.icon.addEventListener('mousedown', (e) => {
		if(e.target.className === 'iconItem'){
			this.flag = true;
			this.coord = {
				x: e.offsetX,
				y: e.offsetY
			}
		}
	});
	document.addEventListener('mousemove', (e) => {
		e.preventDefault();
		const target = e.target;
		if(target.className === 'iconItem'){
			if(this.flag){
				target.style.position = 'fixed';
				target.style.left = (e.pageX - this.coord.x) + 'px';
				target.style.top = (e.pageY - this.coord.y) + 'px';
				target.style.zIndex = 3;
			}
		}
	});
	document.addEventListener('mouseup', (e) => {
		this.flag = false;
		let list = this.gamePlaceList.querySelectorAll('li');
		if(e.target.className === 'iconItem'){
				list.forEach((el) => {
					const top = el.getBoundingClientRect().top;
					const right = el.getBoundingClientRect().right;
					const bottom = el.getBoundingClientRect().bottom;
					const left = el.getBoundingClientRect().left;

					if(e.pageX >= left && e.pageX <= right && e.pageY >= top && e.pageY <= bottom){
						if(el.childElementCount == 0){
							const copy = e.target.cloneNode(true);
							copy.removeAttribute('style');
							el.append(copy.lastElementChild);
						}
					}
				})
				e.target.removeAttribute('style');
		}
		this.checkUp(list);
	});
}

checkUp(list){
	let arr = [];
	list.forEach((el, i) => {
	arr.push(+(el.innerHTML.split('').slice(16,17)));
	})
	this.zeroCheck(arr);
}

zeroCheck(arr){
	if(arr.every(el => el > 0)){
		if(this.checkVerticalLine(arr) && this.checkHorizontLine(arr)){
			this.info.textContent = 'Вы победили! Перейти на следующий уровень?' 
			this.iconLevel.children[0].textContent = 'Да';
			this.iconLevel.children[1].textContent = 'Нет';
		}
		else {
			this.info.textContent = 'Вы проиграли. Попробовать ещё раз?';
			this.iconLevel.children[0].textContent = 'Да';
			this.iconLevel.children[1].textContent = 'Нет';
		}
	}
}

question(){
	this.iconLevel.addEventListener('click', (e) => {
		let t = e.target;
		let info = document.querySelector('.info').textContent;
		if(t.textContent === 'Да'){
			if(info.includes('победили')){
				this.level = 2;
				this.statusInfo();
			}
			if(info.includes('проиграли')){
				this.level = 1;
				this.statusInfo();
			}
		}
	})
}

statusInfo(){
	this.clearItems();
	this.sendpost();
	this.info.textContent = '';
	this.iconLevel.children[0].textContent = 'Уровень';
	this.iconLevel.children[1].textContent = `${this.level}`;
}

checkHorizontLine(arr){
	let curr = [];
	for(let i = 0; i < arr.length; i = i + Math.sqrt(arr.length)){
		let sum = 0;
		for(let k = 0; k < Math.sqrt(arr.length); k++){
			sum += arr[i + k];
		}
		curr.push(sum);
		}
	 let h = curr.every(el => el === curr[0]);
	 return h
}

checkVerticalLine(arr){
	let curr = [];
	for(let i = 0; i < Math.sqrt(arr.length); i++){
		let sum = 0;
		for(let k = 0; k < arr.length; k = k + Math.sqrt(arr.length)){
			sum += arr[i + k];
		}
		curr.push(sum);
		}
	 let v = curr.every(el => el === curr[0]);
	return v
}

 init(){
	this.sendpost();
	this.move();
	this.question();
	}
}