import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const signUp = createAsyncThunk(
  "user/signUp",
  async ({ formData }, { rejectWithValue }) => {
    try {
      let url = "/api/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue("User already exists");
      }
      return data;
    } catch (error) {
      return rejectWithValue(
        "An unexpected error occurred. Please try again later"
      );
    }
  }
);

export const signIn = createAsyncThunk(
  "user/signIn",
  async ({formData}, { rejectWithValue }) => {
    try {
      let url = "/api/auth/signin";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        const errorMessage = data.message || "Invalid credentials";
        return rejectWithValue(errorMessage);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const googleSignUp = createAsyncThunk(
  "user/googleSignUp",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/auth/google/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "User already exists");
      }
      return data;
    } catch (error) {
      return rejectWithValue(
        "An unexpected error occurred. Please try again later"
      );
    }
  }
);

export const googleSignIn = createAsyncThunk(
  "user/googleSignIn",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/auth/google/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        const errorMessage = data.message || "Invalid credentials";
        return rejectWithValue(errorMessage);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({userId,formData}, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/user/update/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to update user");
      }
      return data;
    } catch (error) {
      return rejectWithValue(
        "An unexpected error occurred. Please try again later"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async ({userId}, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/user/delete/${userId}`, {
        method: "DELETE"
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to delete user');
      }
      return data;
    } catch (error) {
      return rejectWithValue(
        'An unexpected error occurred. Please try again later'
      );
    }
  }
);

export const signout = createAsyncThunk(
  'user/signout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to sign out');
      }
      return data;
    } catch (error) {
      return rejectWithValue('An unexpected error occurred. Please try again later');
    }
  }
);


const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    errorMessage: "",
    successMessage: "",
    userInfo: null,
  },
  reducers: {
    clearMessages(state) {
      state.errorMessage = "";
      state.successMessage = "";
    },
    setValidationError(state, action) {
      state.errorMessage = action.payload;
    },
    setGlobalError(state, action) {
      state.errorMessage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Signed in successfully";
        state.userInfo = action.payload;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage =
          action.payload ||
          "An unexpected error occurred. Please try again later";
      })
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(signUp.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "User created successfully";
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage =
          action.payload ||
          "An unexpected error occurred. Please try again later";
      }).addCase(googleSignIn.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(googleSignIn.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Signed in successfully";
        state.userInfo = action.payload;
      })
      .addCase(googleSignIn.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage =
          action.payload ||
          "An unexpected error occurred. Please try again later";
      })
      .addCase(googleSignUp.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(googleSignUp.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "User created successfully";
      })
      .addCase(googleSignUp.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage =
          action.payload ||
          "An unexpected error occurred. Please try again later";
      }) .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "User updated successfully";
        state.userInfo = { ...state.userInfo, ...action.payload };
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage =
          action.payload ||
          "An unexpected error occurred. Please try again later";
      }).addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
        state.userInfo = {};
        state.successMessage = 'User deleted successfully';
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      }).addCase(signout.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(signout.fulfilled, (state) => {
        state.loading = false;
        state.userInfo = null;
        state.successMessage = 'User signed out successfully';
      })
      .addCase(signout.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      });
  },
});

export const { clearMessages, setValidationError, setGlobalError } = userSlice.actions;
export default userSlice.reducer;
