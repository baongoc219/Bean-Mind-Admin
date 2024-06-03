import { ElementType, lazy, Suspense } from 'react';
import { Navigate, useLocation, useRoutes } from 'react-router-dom';
// components
import LoadingScreen from '../components/LoadingScreen';
// import RoleBasedGuard from '../guards/RoleBasedGuard';
// config
import { PATH_AFTER_LOGIN } from '../config';
import AuthGuard from '../guards/AuthGuard';
// guards
import GuestGuard from '../guards/GuestGuard';
// hooks
import useAuth from '../hooks/useAuth';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';

// ----------------------------------------------------------------------

const Loadable = (Component: ElementType) => (props: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isAuthenticated } = useAuth();

  const isDashboard = pathname.includes('/dashboard') && isAuthenticated;

  return (
    <Suspense fallback={<LoadingScreen isDashboard={isDashboard} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          ),
        },
        { path: 'login-unprotected', element: <Login /> },
        { path: 'register-unprotected', element: <Register /> },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'new-password', element: <NewPassword /> },
        { path: 'verify', element: <VerifyCode /> },
      ],
    },

    // Dashboard Routes
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'app', element: <GeneralApp /> },
        { path: 'ecommerce', element: <GeneralEcommerce /> },
        { path: 'analytics', element: <GeneralAnalytics /> },
        { path: 'banking', element: <GeneralBanking /> },
        { path: 'booking', element: <GeneralBooking /> },

        {
          path: 'e-commerce',
          children: [
            { element: <Navigate to="/dashboard/e-commerce/shop" replace />, index: true },
            { path: 'shop', element: <EcommerceShop /> },
            { path: 'product/:name', element: <EcommerceProductDetails /> },
            { path: 'list', element: <EcommerceProductList /> },
            { path: 'product/new', element: <EcommerceProductCreate /> },
            { path: 'product/:name/edit', element: <EcommerceProductCreate /> },
            { path: 'checkout', element: <EcommerceCheckout /> },
          ],
        },
        {
          path: 'subjects',
          children: [
            { path: '', element: <SubjectListPage /> },
            {
              path: 'new',
              element: <SubjectListPage />,
            },
            { path: ':id', element: <SubjectListPage /> },
          ],
        },
        {
          path: 'courses',
          children: [
            { path: '', element: <CourseListPage /> },
            {
              path: 'new',
              element: <CourseNewEditForm />,
            },
            {
              path: ':id/view',
              element: <CourseNewEditForm />,
            },
            { path: ':id', element: <CourseNewEditForm /> },
          ],
        },
        {
          path: 'users',
          children: [
            { path: '', element: <UserListPage /> },
            {
              path: 'new',
              element: <UserEditForm />,
            },
            { path: ':id', element: <UserEditForm /> },
          ],
        },
        {
          path: 'mentors',
          children: [
            { path: '', element: <MentorListPage /> },
            {
              path: 'new',
              element: <MentorEditForm />,
            },
            { path: ':id', element: <MentorEditForm /> },
          ],
        },
        {
          path: 'admins',
          children: [
            { path: '', element: <AdminListPage /> },
            {
              path: 'new',
              element: <AdminEditForm />,
            },
            { path: ':id', element: <AdminEditForm /> },
          ],
        },
        {
          path: 'majors',
          children: [
            { path: '', element: <MajorListPage /> },
            {
              path: 'new',
              element: <MajorCreatePage />,
            },
            { path: ':id', element: <UpdateMajorPage /> },
          ],
        },
        {
          path: 'orders',
          children: [
            { path: '', element: <OrderListPage /> },
            {
              path: 'new',
              element: <OrderListPage />,
            },
            { path: ':id', element: <OrderListPage /> },
          ],
        },
        {
          path: 'certificates',
          children: [
            { path: '', element: <CertificateListPage /> },
            {
              path: 'new',
              element: <CertificateListPage />,
            },
            { path: ':id', element: <CertificateEditForm /> },
          ],
        },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/profile" replace />, index: true },
            { path: 'profile', element: <UserProfile /> },
            { path: 'cards', element: <UserCards /> },
            { path: 'list', element: <UserList /> },
            { path: 'new', element: <UserCreate /> },
            { path: ':name/edit', element: <UserCreate /> },
            { path: 'account', element: <UserAccount /> },
          ],
        },
        {
          path: 'invoice',
          children: [
            { element: <Navigate to="/dashboard/invoice/list" replace />, index: true },
            { path: 'list', element: <InvoiceList /> },
            { path: ':id', element: <InvoiceDetails /> },
            { path: ':id/edit', element: <InvoiceEdit /> },
            { path: 'new', element: <InvoiceCreate /> },
          ],
        },
        {
          path: 'blog',
          children: [
            { element: <Navigate to="/dashboard/blog/posts" replace />, index: true },
            { path: 'posts', element: <BlogPosts /> },
            { path: 'post/:title', element: <BlogPost /> },
            { path: 'new', element: <BlogNewPost /> },
          ],
        },
        {
          path: 'mail',
          children: [
            { element: <Navigate to="/dashboard/mail/all" replace />, index: true },
            { path: 'label/:customLabel', element: <Mail /> },
            { path: 'label/:customLabel/:mailId', element: <Mail /> },
            { path: ':systemLabel', element: <Mail /> },
            { path: ':systemLabel/:mailId', element: <Mail /> },
          ],
        },
        {
          path: 'chat',
          children: [
            { element: <Chat />, index: true },
            { path: 'new', element: <Chat /> },
            { path: ':conversationKey', element: <Chat /> },
          ],
        },
        { path: 'calendar', element: <Calendar /> },
        { path: 'kanban', element: <Kanban /> },
        { path: 'permission-denied', element: <PermissionDenied /> },
      ],
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'coming-soon', element: <ComingSoon /> },
        { path: 'maintenance', element: <Maintenance /> },
        { path: 'pricing', element: <Pricing /> },
        { path: 'payment', element: <Payment /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    {
      path: '/',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [{ element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true }],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// AUTHENTICATION
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
const NewPassword = Loadable(lazy(() => import('../pages/auth/NewPassword')));
const VerifyCode = Loadable(lazy(() => import('../pages/auth/VerifyCode')));

// DASHBOARD

// GENERAL
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));
const GeneralEcommerce = Loadable(lazy(() => import('../pages/dashboard/GeneralEcommerce')));
const GeneralAnalytics = Loadable(lazy(() => import('../pages/dashboard/GeneralAnalytics')));
const GeneralBanking = Loadable(lazy(() => import('../pages/dashboard/GeneralBanking')));
const GeneralBooking = Loadable(lazy(() => import('../pages/dashboard/GeneralBooking')));

// ECOMMERCE
const EcommerceShop = Loadable(lazy(() => import('../pages/dashboard/EcommerceShop')));
const EcommerceProductDetails = Loadable(
  lazy(() => import('../pages/dashboard/EcommerceProductDetails'))
);
const EcommerceProductList = Loadable(
  lazy(() => import('../pages/dashboard/EcommerceProductList'))
);
const EcommerceProductCreate = Loadable(
  lazy(() => import('../pages/dashboard/EcommerceProductCreate'))
);
const EcommerceCheckout = Loadable(lazy(() => import('../pages/dashboard/EcommerceCheckout')));

// INVOICE
const InvoiceList = Loadable(lazy(() => import('../pages/dashboard/InvoiceList')));
const InvoiceDetails = Loadable(lazy(() => import('../pages/dashboard/InvoiceDetails')));
const InvoiceCreate = Loadable(lazy(() => import('../pages/dashboard/InvoiceCreate')));
const InvoiceEdit = Loadable(lazy(() => import('../pages/dashboard/InvoiceEdit')));

// BLOG
const BlogPosts = Loadable(lazy(() => import('../pages/dashboard/BlogPosts')));
const BlogPost = Loadable(lazy(() => import('../pages/dashboard/BlogPost')));
const BlogNewPost = Loadable(lazy(() => import('../pages/dashboard/BlogNewPost')));

// USER
const UserProfile = Loadable(lazy(() => import('../pages/dashboard/UserProfile')));
const UserCards = Loadable(lazy(() => import('../pages/dashboard/UserCards')));
const UserList = Loadable(lazy(() => import('../pages/dashboard/UserList')));
const UserAccount = Loadable(lazy(() => import('../pages/dashboard/UserAccount')));
const UserCreate = Loadable(lazy(() => import('../pages/dashboard/UserCreate')));

// APP
const Chat = Loadable(lazy(() => import('../pages/dashboard/Chat')));
const Mail = Loadable(lazy(() => import('../pages/dashboard/Mail')));
const Calendar = Loadable(lazy(() => import('../pages/dashboard/Calendar')));
const Kanban = Loadable(lazy(() => import('../pages/dashboard/Kanban')));

// TEST RENDER PAGE BY ROLE
const PermissionDenied = Loadable(lazy(() => import('../pages/dashboard/PermissionDenied')));

// MAIN
const ComingSoon = Loadable(lazy(() => import('../pages/ComingSoon')));
const Maintenance = Loadable(lazy(() => import('../pages/Maintenance')));
const Pricing = Loadable(lazy(() => import('../pages/Pricing')));
const Payment = Loadable(lazy(() => import('../pages/Payment')));
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const Page403 = Loadable(lazy(() => import('../pages/Page403')));
const Page404 = Loadable(lazy(() => import('../pages/Page404')));

// SUBJECT
const SubjectListPage = Loadable(lazy(() => import('../pages/Subjects')));

// COURSE
const CourseListPage = Loadable(lazy(() => import('../pages/Courses')));
const CourseNewEditForm = Loadable(lazy(() => import('../pages/Courses/CourseNewEditForm')));

// USER
const UserListPage = Loadable(lazy(() => import('../pages/Users')));
const UserEditForm = Loadable(lazy(() => import('../pages/Users/UserEditForm')));

// MENTOR
const MentorListPage = Loadable(lazy(() => import('../pages/Mentors')));
const MentorEditForm = Loadable(lazy(() => import('../pages/Mentors/MentorEditForm')));

// ADMIN
const AdminListPage = Loadable(lazy(() => import('../pages/Admins')));
const AdminEditForm = Loadable(lazy(() => import('../pages/Admins/AdminEditForm')));

// MAJOR
const MajorListPage = Loadable(lazy(() => import('../pages/Majors')));
const MajorCreatePage = Loadable(lazy(() => import('../pages/Majors/CreateMajor')));
const UpdateMajorPage = Loadable(lazy(() => import('../pages/Majors/UpdateMajor')));

// ORDER
const OrderListPage = Loadable(lazy(() => import('../pages/Orders')));
const CertificateListPage = Loadable(lazy(() => import('../pages/Certificates')));
const CertificateEditForm = Loadable(
  lazy(() => import('../pages/Certificates/components/EditCertificateForm'))
);
