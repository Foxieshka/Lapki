function GridRow({label, value}){
    return (
        <div>
            <dl className="product__table-row"
            style = {{display: 'flex', justifyContent: 'space-between',
                width: '100%', padding: '10px 5px'}}>
                <dt style={{padding: "5px",
                    backgroundColor: '#c4c4c4',
                    fontWeight: '600'}}>
                    {label}:
                </dt>
                <dd>{value}</dd>
            </dl>
            <hr/>
        </div>
    );
}

export default GridRow