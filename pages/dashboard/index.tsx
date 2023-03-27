import DashboardLayout from "@/components/layout/dashboardLayout"
import SavedGames from "@/components/savedGames"



const DashboardPage = () => {

    return (<>
        <SavedGames />
    </>)
}

DashboardPage.PageLayout = DashboardLayout

export default DashboardPage
