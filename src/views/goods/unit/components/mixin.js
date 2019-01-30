export default {
  props: [],
  data() {
    const validatePhone = (rule, value, callback) => {
      const mobileReg = new RegExp(/^1[34578]\d{9}$/)
      if (!value) {
        callback(new Error('请输入手机号'))
      } else if (!mobileReg.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      const passwordReg = new RegExp(/^[0-9A-Za-z]{6,}$/)
      if (!passwordReg.test(value)) {
        callback('密码由6位以上的字母和数字组成')
      } else {
        callback()
      }
    }
    return {
      rules: {
        Name: [{ required: true, message: '输入名称', trigger: 'blur' }]
      }
    }
  }
}
