import { useContext } from 'react';
import {VscGithubInverted} from 'react-icons/vsc';
import { AuthContext } from '../../context/auth';

import styles from './styles.module.scss';

/*
1- Quando o usuário clicar no botão ele será redirecionado par ao GITHUB
2- Quando acessar o Github vai redirecionar o usuário de volta pra aplicação -> Pra isso o Oauth app o authorizaion callback URL tem que ser o mesmo de onde a aplicação está sendo rodada (localhost:3000)*/


export function LoginBox() {
  const { signInUrl } = useContext(AuthContext);

  return (
    <div className={styles.loginBoxWrapper}>
      <strong>Entre e compartilhe sua mensagem</strong>
      <a href={signInUrl} className={styles.signInWithGithub}>
        <VscGithubInverted size="24" />
        Entrar com Github
      </a>
    </div>
  )
}