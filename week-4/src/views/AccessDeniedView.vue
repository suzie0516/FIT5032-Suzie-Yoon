<template>
  <div class="container mt-5">

    <div class="row justify-content-center">
      <div class="col-md-6 text-center">

        <h1>Access Denied</h1>

        <div class="alert alert-danger mt-4">
          You must be logged in to access this page.
        </div>

        <router-link
          to="/login"
          class="btn btn-primary"
        >
          Go to Login
        </router-link>

      </div>
    </div>

  </div>
</template>