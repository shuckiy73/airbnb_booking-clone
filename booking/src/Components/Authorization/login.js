(function validateForms() {
	'use strict'; // Используем строгий режим для избежания ошибок
  
	// Находим все формы с классом .needs-validation
	const forms = document.querySelectorAll('.needs-validation');
  
	// Перебираем каждую форму и добавляем обработчик события submit
	forms.forEach((form) => {
	  form.addEventListener('submit', (event) => {
		// Проверяем валидность формы
		if (!form.checkValidity()) {
		  event.preventDefault(); // Отменяем отправку формы
		  event.stopPropagation(); // Останавливаем всплытие события
		}
  
		// Добавляем класс was-validated для отображения сообщений об ошибках
		form.classList.add('was-validated');
	  }, false);
	});
  })();