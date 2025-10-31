import React from 'react'

const Profile = ({user, error}) => {
  return (
    <div>
        {error && <p className='text-red-500'>{error}</p>}
      {user ? (
        <div>
            <h2>{user.username}</h2>
        </div>
      ) : <div></div>}
    </div>
  )
}

export default Profile
