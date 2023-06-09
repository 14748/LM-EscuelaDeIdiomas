import {
  stripe,
  dangerOnValidationRemover,
  validateForm,
  validateForm1,
  clearSelectBoxOnChange,
  clearCheckboxOnChange,
  clearRadiosOnChecked,
  updatePriceText,
  handleSelection,
  resetForm
} from "./helpers.js";

const productsData = {
  "01": {
    "productId": "price_1N2zMdASksDI5wteY4NTvonC",
    "price": "75",
  },
  "02": {
    "productId": "price_1N2zM3ASksDI5wtehOpnso4v",
    "price": "50",
  },
  "03": {
    "productId": "price_1N2zLEASksDI5wteR34yl20j",
    "price": "380",
  },
  "04": {
    "productId": "price_1N2zMPASksDI5wteK8UZaOO4",
    "price": "550",
  },
  "05": {
    "productId": "price_1N9sQiASksDI5wteP4k37jxM",
    "price": "46",
  },
  "06": {
    "productId": "price_1N9sR3ASksDI5wtevrRHcwJ5",
    "price": "86",
  },
  "07": {
    "productId": "price_1N9sRMASksDI5wteILtT3Zmm",
    "price": "96",
  },
  "08": {
    "productId": "price_1N9sRlASksDI5wtex6xWU1zC",
    "price": "120",
  },

};

const coursesData = {
  "04": {
    "hours": "15:30 a 16:30",
    "course": "Inglés A2 Refuerzo estudiantes FP",
    "days": "Lunes y miércoles",
    "price": "380 € ó 50 € mes"
  },
  "05": {
    "hours": "16:30 a 18:00",
    "course": "Inglés A2",
    "days": "Lunes y miércoles",
    "price": "550 € ó 75 € mes"
  },
  "08": {
    "hours": "18:00 a 19:30",
    "course": "Inglés B1.1",
    "days": "Lunes y miércoles",
    "price": "550 € ó 75 € mes"
  },
  "09": {
    "hours": "16:30 a 18:00",
    "course": "Inglés B1.2",
    "days": "Martes y jueves",
    "price": "550 € ó 75 € mes"
  },
  "10": {
    "hours": "15:30 a 16:30",
    "course": "Inglés B1 Refuerzo estudiantes FP",
    "days": "Martes y jueves",
    "price": "380 € ó 50 € mes"
  },
  "11": {
    "hours": "15:30 a 16:30",
    "course": "Inglés B1 Preparación Examen Oficial estudiantes FP",
    "days": "Lunes y miércoles",
    "price": "380 € ó 50 € mes"
  },
  "12": {
    "hours": "18:00 a 19:30",
    "course": "Inglés B1 Preparación Examen Oficial",
    "days": "Lunes y miércoles",
    "price": "550 € ó 75 € mes"
  },
  "13": {
    "hours": "19:30 a 21:00",
    "course": "Inglés B2.1",
    "days": "Lunes y miércoles",
    "price": "550 € ó 75 € mes"
  },
  "14": {
    "hours": "9:30 a 11:00",
    "course": "Inglés B2.1",
    "days": "Martes y jueves",
    "price": "550 € ó 75 € mes"
  },
  "15": {
    "hours": "16:30 a 18:00",
    "course": "Inglés B2.2",
    "days": "Lunes y miércoles",
    "price": "550 € ó 75 € mes"
  },
  "16": {
    "hours": "15:30 a 16:30",
    "course": "Inglés B2 Preparación Examen Oficial estudiantes FP",
    "days": "Martes y jueves",
    "price": "380 € ó 50 € mes"
  },
  "17": {
    "hours": "18:00 a 19:30",
    "course": "Inglés B2 Preparación Examen Oficial",
    "days": "Martes y jueves",
    "price": "550 € ó 75 € mes"
  }
};

//Acccess to the required form elements
const radioSets = document.querySelectorAll('[data-radio-set]');
const dni = document.getElementById('dni_validation');
const phoneNumber = document.getElementById('phone_validation');
const email = document.getElementById('email_validation');
const birth = document.getElementById('birth_validation');
const enrollment = document.getElementById('enrollment_validation');
const fileInput = document.querySelector('#file-js-example input[type=file]');
const selectFPCourse = document.getElementsByName('coursesFP');
const oldStudent = document.getElementsByName('old_student');
const formUserDetails = document.querySelector('form[name="user_details"]');
const formUserCourseDetails = document.querySelector('form[name="user_course_details"]');
const courseWeekdaysRadio = document.getElementsByName('course_weekdays');
const typeOfPaymentRadio = document.getElementsByName('payment_type');
const courseHoursSelectBox = document.getElementsByName('courseHours');
const englishCourseSelectBox = document.getElementsByName('englishCourse');
const returnBtn = document.getElementById('returnBtn');
const policiesCheckbox = document.getElementsByClassName('checkbox');
const courseSelect = document.getElementById("course");
const paymentTypeInputs = document.querySelectorAll('.field input[name="payment_type"]');
const courseSelected = document.querySelector('select[name="englishCourse"]');
const courseWeekdays = document.querySelector('input[name="course_weekdays"]');
const courseHours = document.querySelector('select[name="courseHours"]');
const coursePaymentType = document.querySelector('input[name="payment_type"]');
const resetElements = document.querySelectorAll('.reset-me');
const resetElementsSub = document.querySelectorAll('.reset-me-sub');
let totalFilesSelected = 0;
let paymentTypeGlobal = 0;
let newElement;
let currentItemSelected;
let hasUserDoneFP = true;

clearRadiosOnChecked(courseWeekdaysRadio);
clearRadiosOnChecked(typeOfPaymentRadio);
clearSelectBoxOnChange(courseHoursSelectBox);
clearSelectBoxOnChange(englishCourseSelectBox);
clearCheckboxOnChange(policiesCheckbox);
clearSelectBoxOnChange(selectFPCourse);
clearRadiosOnChecked(oldStudent);

//Listen for a change in ALL the radio buttons, if state has changed, remove the danger class of OLD element and add it to the NEW one
radioSets.forEach(function (set) {
  const radioButtons = set.querySelectorAll('.radioUpgraded');

  radioButtons.forEach(function (radioButton) {
    radioButton.addEventListener("change", function () {
      const label = radioButton.nextElementSibling;

      set.querySelectorAll(".button").forEach(function (label) {
        label.classList.add("is-light");
      });

      label.classList.remove("is-light");
    });
  });
});

//Listen for a change in DocumentInputs if the input is not empty, remove the danger class
fileInput.onchange = () => {
  if (fileInput.files.length > 0) {
    totalFilesSelected++;
    dangerOnValidationRemover(fileInput.parentNode);
    dangerOnValidationRemover(fileInput.parentNode.parentNode);
    const fileName = document.querySelector('#file-js-example .file-name');
    fileName.textContent = fileInput.files[0].name;
  }
};

//Listen for a change in the select box PAYMENT TYPE, when detected update PRICE and PAYMENTYPEGLOBAL
paymentTypeInputs.forEach((input) => {
  input.addEventListener('click', () => {
    if (document.getElementById('radioCustom6').checked) {
      paymentTypeGlobal = 1;
    } else {
      paymentTypeGlobal = 0;
    }
    currentItemSelected = updatePriceText(newElement, courseSelect, courseHours, coursesData, paymentTypeGlobal, currentItemSelected);
  });
});

//First form trying to be pushed
formUserDetails.addEventListener('submit', (event) => {
  event.preventDefault();

  let isFormValid = validateForm(totalFilesSelected, fileInput, dni, email, phoneNumber, birth, enrollment);

  if (isFormValid) {
    formUserDetails.classList.add('is-hidden');
    formUserCourseDetails.classList.remove('is-hidden');

    if (selectFPCourse[0].value === '') {   
      hasUserDoneFP = false;
    }else
    {
      hasUserDoneFP = true;
    }
  }
});

//Subform trying to be pushed
formUserCourseDetails.addEventListener('submit', (event) => {
  event.preventDefault();

  let isFormValid = validateForm1();

  if (isFormValid) {
    stripe(currentItemSelected, productsData);
  }
});

//Return button clicked
returnBtn.addEventListener('click', (event) => {
  event.preventDefault();
  formUserCourseDetails.classList.add('is-hidden');
  formUserDetails.classList.remove('is-hidden');
});

//Listen for a change in the select box COURSE, when detected update PRICE
courseSelected.addEventListener('change', () => {
  currentItemSelected = updatePriceText(newElement, courseSelect, courseHours, coursesData, paymentTypeGlobal);
});

//Listen for a change in the select box COURSE HOURS, when detected update PRICE
courseSelect.addEventListener('change', (event) => {
  const selectedCourse = event.target.value;
  newElement = document.createElement("p");

  for (const courseId in coursesData) {
    const course = coursesData[courseId];
    if (course.course === selectedCourse) {
      const text = document.createTextNode(course.price.split("ó")[paymentTypeGlobal]);
      newElement.appendChild(text);
      break;
    }
  }

  if (courseSelect.nextElementSibling !== null) {
    courseSelect.parentNode.removeChild(courseSelect.nextElementSibling);
  }

  courseSelect.parentNode.appendChild(newElement);
  currentItemSelected = updatePriceText(newElement, courseSelect, courseHours, coursesData, paymentTypeGlobal, currentItemSelected);
});

//Listen for a change in the radio COURSE HOURS, when detected update PRICE and HANDLE SELECTION
courseWeekdays.addEventListener('change', function () {
  handleSelection(courseWeekdays, courseHours, coursePaymentType, courseSelect, coursesData, hasUserDoneFP, courseWeekdaysRadio);
  currentItemSelected = updatePriceText(newElement, courseSelect, courseHours, coursesData, paymentTypeGlobal);
});

//Listen for a change in the select box COURSE HOURS, when detected update PRICE and HANDLE SELECTION
courseHours.addEventListener('change', function () {
  handleSelection(courseWeekdays, courseHours, coursePaymentType, courseSelect, coursesData, hasUserDoneFP, courseWeekdaysRadio);
  currentItemSelected = updatePriceText(newElement, courseSelect, courseHours, coursesData, paymentTypeGlobal);
});

//LISTEN FOR A CHANGE IN THE RADIO BUTTONS COURSE WEEKDAYS, WHEN DETECTED UPDATE PRICE AND HANDLE SELECTION
coursePaymentType.addEventListener('change', function () {
  handleSelection(courseWeekdays, courseHours, coursePaymentType, courseSelect, coursesData, hasUserDoneFP, courseWeekdaysRadio);
  currentItemSelected = updatePriceText(newElement, courseSelect, courseHours, coursesData, paymentTypeGlobal);
});

resetForm(formUserDetails, resetElements, radioSets);
resetForm(formUserCourseDetails, resetElementsSub, radioSets);