import Router from 'koa-router'
import config from '../config'
import user from '../controller/user'
import article from '../controller/article'
import articleCate from '../controller/articleCate'
import collect from '../controller/collect'
import like from '../controller/like'
import comment from '../controller/comment'
import love from '../controller/love'
import resource from '../controller/resource'
import tags from '../controller/tags'
import {checkToken} from '../utils/token'

const router = new Router({
  prefix: config.routerBaseApi // 设置接口基础路径
})

router.get('/user/login', user.login)
router.get('/user/logout', checkToken, user.logout)
router.get('/user/getUserInfo', checkToken, user.getUserInfo)
router.get('/user/getList', user.getList)
router.post('/user/edit', checkToken, user.edit)
router.post('/user/editRole', checkToken, user.editRole)
router.get('/user/getWebBlogUser', user.getWebBlogUser)

router.get('/article/getList', article.getList)
router.get('/article/getListByClass', article.getListByClass)
router.get('/article/getInfo', article.getInfo)
router.post('/article/add', checkToken, article.add)
router.post('/article/edit', checkToken, article.edit)
router.post('/article/delete', checkToken, article.delete)
router.get('/article/getHomeInfo', article.getHomeInfo)

router.get('/articleCate/getList', articleCate.getList)
router.get('/articleCate/getAllList', articleCate.getAllList)
router.post('/articleCate/add', checkToken, articleCate.add)
router.post('/articleCate/edit', checkToken, articleCate.edit)
router.post('/articleCate/delete', checkToken, articleCate.delete)

router.post('/collect/edit', collect.edit)
router.get('/collect/getInfo', collect.getInfo)

router.post('/like/edit', like.edit)
router.get('/like/getInfo', like.getInfo)

router.get('/comment/getList', comment.getList)
router.get('/comment/getAdminList', comment.getAdminList)
router.post('/comment/add', comment.add)
router.post('/comment/edit', checkToken, comment.edit)
router.get('/comment/getTopComment', comment.getTopComment)
router.post('/comment/delete', checkToken, comment.delete)

router.get('/comment/getAllList', comment.getAllList)

router.post('/love/add', love.add)

router.get('/resource/getList', checkToken, resource.getList)
// router.post('/resource/upload', checkToken, upload.single('face'), resource.upload);
router.post('/resource/upload', checkToken, resource.upload)
router.post('/resource/delete', checkToken, resource.delete)

router.get('/tags/getList', tags.getList)
router.get('/tags/getAllList', tags.getAllList)
router.post('/tags/add', checkToken, tags.add)
router.post('/tags/edit', checkToken, tags.edit)
router.post('/tags/delete', checkToken, tags.delete)

export default router
