import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss','./auth-form-responsive.scss']
})

export class AuthFormComponent implements OnInit {

  @Input() type: string = '';
  email: string = '';
  pswd: string = '';
  pswdConfirm: string = '';
  authForm: FormGroup;


  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder ) { 
    this.authForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      pswd: ['', [Validators.required, Validators.minLength(6)]],
      pswdConfirm: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
  }

  submitForm() {
    const emailControl = this.authForm.get('email');
    const passwordControl = this.authForm.get('pswd');
  
    if (emailControl && passwordControl) {
      const email = emailControl.value;
      const password = passwordControl.value;
  
      if (!email || !password) {
        console.error('Por favor, preencha todos os campos.');
        return;
      }
  
      if (this.type === 'Cadastrar') {
        const passwordConfirmControl = this.authForm.get('pswdConfirm');
  
        if (passwordConfirmControl) {
          const passwordConfirm = passwordConfirmControl.value;

          console.log(password,passwordConfirm)
  
          if (password === passwordConfirm) {
            this.createUserWithEmailAndPassword(email, password);
          } else {
            console.error('As senhas precisam ser iguais');
          }
        }
      } else if (this.type === 'Login') {
        this.signInWithEmailAndPassword(email, password);
        console.log('login feito')
      }
    }
  }
  


  createUserWithEmailAndPassword(email: string, password: string): void {
      this.authService.createUserWithEmailAndPasswordForms(email, password)
      .then(() => {
        this.router.navigate(['/login']);
        
      })
      .catch((error) => {
        console.error(error)
      });
  }

  signInWithEmailAndPassword(email: string, password: string): void {
    this.authService.signInWithEmailAndPasswordForms(email, password)
    .then(() => {
      this.router.navigate(['/service-page']);
    })
    .catch((error) => {
      console.error(error)
    });

  }

  signInWithGoogle(): void {
    this.authService.signInWithGoogle()
      .then(() => {
        this.router.navigate(['/service-page']);
      })
      .catch((error) => {
        console.error(error)
      });
  }

}
