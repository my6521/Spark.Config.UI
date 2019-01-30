const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  // user getter
  token: state => state.user.token,
  IsAdmin: state => state.user.IsAdmin,
  username: state => state.user.username,
  realname: state => state.user.realname,
  roleId: state => state.user.roleId,
  depname: state => state.user.depname,
  status: state => state.user.status,
  phone: state => state.user.phone,
  email: state => state.user.email,
  roles: state => state.user.roles,
  // permissions getters
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  errorLogs: state => state.errorLog.logs
}
export default getters
