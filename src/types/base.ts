import { JwtPayload } from "jsonwebtoken"
import * as mongoose from 'mongoose'

/** 用户信息类型 */
export interface UserInfoType extends mongoose.Document{
    _id?:any,
    userId?: string|number,
    username?: string,
    avatar?:string,
    email?:string,
    bio?:string,
    blog?: string,
    webBlogName?: string,
    webBlog?:string,
    webBlogIcon?:string,
    webBlogDesc?:string,
    webBlogState?: number,
    label?:string,
    origin?:string,
    // 发布日期
    createDate?: Date,
    // 最后修改日期
    lastModifiedDate?: Date,
    lastLoginDate?: Date,
    status?:string // 用户权限 3
}

export interface DecodeUserType extends JwtPayload{
    _id?:any,
    userId?: string|number
}

export interface UserTokenType {
    _id:any,
    userId: string|number
}

interface QueryRegex{
    $regex?:string|number,
    
}
interface ArticleQueryContent {
    title?: Partial<QueryRegex>,
    _id?: any,
    description?:Partial<QueryRegex>,
    username?:Partial<QueryRegex>,
    userId?:Partial<QueryRegex>
}

interface $eq {
    $eq: any
}

interface ArticleQueryElemMatch{
    $elemMatch?:Partial<$eq>
}

export interface ArticleQueryType {
    state?: number,
    $or?: Array<ArticleQueryContent>
    $and?:Array<ArticleQueryContent>,
    classId?:any,
    tags?: Partial<ArticleQueryElemMatch>
}



export interface CollectQueryType {
    state?: string|number,
    $or?: Array<ArticleQueryContent>
}

export interface UserQueryType{
    $or?:Array<ArticleQueryContent>
}

export interface ArticleTimeType{
    year: string,
    list: any[]
}
export interface ArticleTimeObjType{
    [year: string]: Array<any>
}


export interface ArticleInfoType extends mongoose.Document{
    _id?:any,
    title?: string,
    createDate?: Date,
    // 最后修改日期
    lastModifiedDate?: Date
}

export interface CommentInfoType extends mongoose.Document{
    _id?:any,
    createDate?: Date
    userId?:string,
    articleId?: mongoose.ObjectId|string,
    content?: string,
    parentId?: string, // 1 开启 0 不开启
    state?: number
}

export interface CommentQueryType {
    _id?:any,
    userId?:string,
    username?: string,
    avatar?: string,
    parentUserId?: string,
    parentId?: string,
    parentAvatar?: string,
    label?: string
}

export interface BrowseListType{
    title: string,
    count: number,
    articleId: string
}

interface fileDataType extends File{
    name:string,
    path:string
}

interface file{
    file:fileDataType
}



export interface FileType{
    files: Partial<file>
}


export interface AuthTokenType{
    access_token: string,
    token_type?: string,
    uid?: number
}

export interface MongodbConfigType{
    host: string,
    database: string,
    port: number,
    user: string,
    password: string,
    rs_name: string
}

export interface  JwtConfigType {
    tokenName: string,
    tokenSecret: string,
    expiresIn: string // 10天有效期
  }


  export interface ErrorType extends Error{
      code?: string|number,
      msg?: string
  }