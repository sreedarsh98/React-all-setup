import React, { useEffect } from 'react'
import api from '../helpers'

const Login = () => {

  useEffect(() => {
    api.post(`/auth/login`, {
      username: 'emilys',
      password: 'emilyspass',
    }).then((res)=>{
      console.log(res,"log");
      
    })
  }, [])



  return (
    <div className='account-pages my-5 pt-sm-5'>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='text-center'>
              <a className='mb-5'>Machine Test</a>
            </div>
          </div>
        </div>
        <div className='row align-items-center justify-content-center mt-5'>
          <div className='col-md-8 col-lg-6 col-xl-5'>
            <div className='card'>
              <div className='card-body p-4'>
                <div className='mt-2 text-center'>
                  <h5 className='text-primary'>Welcome Back</h5>
                  <p className='text-muted'>Sign in to continue</p>
                  <div className='p-2 mt-4'>
                    <form>
                      <div className='mb-2'>
                        <label className='form-label'>User Name</label>
                        <input className='form-control' />
                      </div>
                      <div className='mb-2'>
                        <label className='form-label'>Password</label>
                        <input className='form-control' />
                      </div>
                      <div className='mt-3 text-end'>
                        <button className='btn btn-primary w-sm waves-effect waves-light'>Submit</button>
                      </div>

                    </form>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}

export default Login