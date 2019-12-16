import { Alert, Checkbox } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';

import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Dispatch, AnyAction } from 'redux';
import { FormComponentProps } from 'antd/es/form';
// import Link from 'umi/link';
import { connect } from 'dva';
import { LoginModelState } from '@/models/login';
import LoginComponents from './components/Login';
import styles from './style.less';
import { LoginParamsType } from '@/services/login';
import { ConnectState } from '@/models/connect';
import { md5Hash } from '@/utils/utils';

const { UserName, Password, Submit, ImgCaptcha } = LoginComponents;

interface LoginProps {
  dispatch: Dispatch<AnyAction>;
  userLogin: LoginModelState;
  submitting?: boolean;
}
interface LoginState {
  type: string;
  autoLogin: boolean;
}

class Login extends Component<LoginProps, LoginState> {
  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  state: LoginState = {
    type: 'account',
    autoLogin: true,
  };

  changeAutoLogin = (e: CheckboxChangeEvent) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  handleSubmit = (err: unknown, values: LoginParamsType) => {
    if (!err) {
      const { dispatch, userLogin } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          username: values.username,
          password: md5Hash(values.password),
          captcha_id: userLogin.captchaId,
          captcha_code: values.captcha_code,
        },
      });
    }
  };

  onTabChange = (type: string) => {
    this.setState({ type });
  };

  onGetCaptcha = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'login/reloadCaptcha' });
  };

  onCreate = (form?: FormComponentProps['form']) => {
    this.loginForm = form;
    const { dispatch } = this.props;
    dispatch({ type: 'login/getCaptcha' });
  };

  renderMessage = (content: string) => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { userLogin = {}, submitting } = this.props;
    const { status, message, type: loginType, captcha } = userLogin;
    const { type, autoLogin } = this.state;

    return (
      <div className={styles.main}>
        <LoginComponents
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          onCreate={this.onCreate}
        >
          {/* <Tab key="account" tab={formatMessage({ id: 'user-login.login.tab-login-credentials' })}> */}
          {status === 'error' &&
            loginType === 'account' &&
            !submitting &&
            this.renderMessage(message || '')}
          <UserName
            name="username"
            placeholder={`${formatMessage({ id: 'user-login.login.userName' })}`}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'user-login.userName.required' }),
              },
            ]}
          />
          <Password
            name="password"
            placeholder={`${formatMessage({ id: 'user-login.login.password' })}`}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'user-login.password.required' }),
              },
            ]}
            onPressEnter={e => {
              e.preventDefault();
              if (this.loginForm) {
                this.loginForm.validateFields(this.handleSubmit);
              }
            }}
          />
          <ImgCaptcha
            name="captcha_code"
            captcha={captcha}
            placeholder={formatMessage({ id: 'user-login.verification-code.placeholder' })}
            onGetImgCaptcha={this.onGetCaptcha}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'user-login.verification-code.required' }),
              },
            ]}
          />
          {/* </Tab> */}
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="user-login.login.remember-me" />
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              <FormattedMessage id="user-login.login.forgot-password" />
            </a>
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="user-login.login.login" />
          </Submit>
        </LoginComponents>
      </div>
    );
  }
}

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
