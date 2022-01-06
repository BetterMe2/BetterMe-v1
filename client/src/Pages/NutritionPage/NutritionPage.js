import React, { useEffect, useState, PureComponent } from 'react';
import { useSelector, useStore } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Nav from '../../Components/Navigation/Navigation';
import Footer from '../../Components/Footer/Footer';
import { PieChart, Pie, Cell, Sector, ResponsiveContainer } from 'recharts';

// pull state to get the user information and the last recipe clicked 
// display a piechart of the meal with sections for protien, fat and carbs as a portion of a 2000cal daily intake


 



function NutritionPage() {

    // save specifying param ID
    const { id } = useParams();
    // console.log('Here is the storage: ', window.localStorage.item)

    let item;
    //if there's an idea, get that specific id
    id ? item = window.localStorage.getItem('item'+id) : item = window.localStorage.getItem('item')
    // const item = window.localStorage.getItem('item');
    const recipe  = JSON.parse(item);
    // const { id } = useParams();
    // const [item, setItem] = useState(null);

    // const navigate = useNavigate();

    // const user = useSelector(state => state.user.user);


    
    //pulling the grams and multipying by the corresponding Caloric density
    const proteinCalories = recipe.nutrition.nutrients[8].amount * 4
    const carbCalories = recipe.nutrition.nutrients[3].amount * 4
    const fatCalories = recipe.nutrition.nutrients[1].amount * 9
    const dailyRemainingCalories = 2000 - proteinCalories - carbCalories - fatCalories

    // setting pie chart data
    const data = [
        {name:'protein', calories:proteinCalories},
        {name:'fats', calories:fatCalories},
        {name:'carbohydrate', calories:carbCalories},
        {name:'daily total', calories:dailyRemainingCalories},
    ];
    
    //setting a color array for pieChart cells
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const RADIAN = Math.PI / 180;
    // Func to generate percentage based labels for the pie chart
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        index
      }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
      
        return (
          <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
          >
            {`${(percent * 100).toFixed(0)}%`}
          </text>
        );
      };


      

    return (
        <>
            <Nav />
                <div>
                
                    <PieChart width={700} height={700}>
                        <Pie data = {data} dataKey= "calories" 
                         paddingAngle= {3} 
                         label={renderCustomizedLabel} 
                         outerRadius={250} 
                         innerRadius={175} 
                         fill="#8884d8">
                         {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}   
                        </Pie>
                    </PieChart>
                </div>
            <Footer />
        </>
    )

}
export default NutritionPage;
